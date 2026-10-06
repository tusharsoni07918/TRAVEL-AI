import { TripFormData } from '../types/travel';
import { GenerateItineraryResponse, GenerationError } from '../types/itinerary';

export async function checkModelStatus(): Promise<{
  modelTargeted: string;
  hasApiKey: boolean;
  status: string;
  message: string;
}> {
  try {
    const res = await fetch('/api/model-status');
    if (!res.ok) throw new Error('Status endpoint unavailable');
    return await res.json();
  } catch (err) {
    return {
      modelTargeted: 'gemma-4-31b-it',
      hasApiKey: false,
      status: 'unknown',
      message: 'Could not connect to backend server.'
    };
  }
}

export async function requestGemmaItinerary(
  formData: TripFormData
): Promise<GenerateItineraryResponse> {
  try {
    const response = await fetch('/api/generate-itinerary', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      return {
        success: false,
        error: data.error || {
          type: 'UNKNOWN_ERROR',
          message: 'Unable to generate your itinerary right now. Your trip details are safe. Please try again.',
          diagnosticDetails: `Server responded with HTTP ${response.status}`,
          modelTargeted: 'gemma-4-31b-it'
        }
      };
    }

    return {
      success: true,
      itinerary: data.itinerary
    };
  } catch (err: any) {
    console.error('Network or client failure requesting itinerary:', err);
    return {
      success: false,
      error: {
        type: 'NETWORK_ERROR',
        message: 'Unable to generate your itinerary right now. Your trip details are safe. Please try again.',
        diagnosticDetails: err.message || 'Network connection failed.',
        modelTargeted: 'gemma-4-31b-it'
      }
    };
  }
}

export async function customizeGemmaItinerary(
  currentItinerary: any,
  plannerData: TripFormData,
  customInstruction: string
): Promise<{
  success: boolean;
  itinerary?: any;
  customizationSummary?: string;
  error?: GenerationError;
}> {
  try {
    const response = await fetch('/api/customize-itinerary', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        currentItinerary,
        plannerData,
        customInstruction,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      return {
        success: false,
        error: data.error || {
          type: 'UNKNOWN_ERROR',
          message: 'Unable to customize your itinerary right now. Your trip details are safe. Please try again.',
          diagnosticDetails: `Server responded with HTTP ${response.status}`,
          modelTargeted: 'gemma-4-31b-it'
        }
      };
    }

    return {
      success: true,
      itinerary: data.itinerary,
      customizationSummary: data.customizationSummary
    };
  } catch (err: any) {
    console.error('Network or client failure customizing itinerary:', err);
    return {
      success: false,
      error: {
        type: 'NETWORK_ERROR',
        message: 'Unable to update your itinerary right now. Please check your network connection.',
        diagnosticDetails: err.message || 'Network connection failed.',
        modelTargeted: 'gemma-4-31b-it'
      }
    };
  }
}
