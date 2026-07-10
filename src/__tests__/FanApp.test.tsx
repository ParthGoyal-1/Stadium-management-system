import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import FanApp from '../components/FanApp';
import { MOCK_STADIUM_STATE, setupFetchMock } from './mocks';

describe('FanApp Portal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Restore fetch to avoid leaking mock state
    globalThis.fetch = undefined as any;
  });

  it('renders smart arena navigation card on default tab', () => {
    const addIncidentMock = vi.fn();
    const notifyMock = vi.fn();

    render(
      <FanApp
        state={MOCK_STADIUM_STATE}
        addIncident={addIncidentMock}
        addSystemNotification={notifyMock}
        activeFanTab={2}
      />
    );

    expect(screen.getByText('Dynamic AI Arena Navigation')).toBeInTheDocument();
    expect(screen.getByText('Your Starting Location')).toBeInTheDocument();
    expect(screen.getByText('Target Destination')).toBeInTheDocument();
  });

  it('tests routing api calls and updates UI with the result', async () => {
    const addIncidentMock = vi.fn();
    const notifyMock = vi.fn();

    const mockRouteResult = {
      route: ['Walk 10m north', 'Take elevators to Row 15', 'Turn left'],
      explanation: 'Optimized via Elevator 2 avoiding stairs.',
      estimatedTimeMinutes: 7,
      distanceMeters: 250
    };

    // Mock successful route fetch
    setupFetchMock(mockRouteResult);

    render(
      <FanApp
        state={MOCK_STADIUM_STATE}
        addIncident={addIncidentMock}
        addSystemNotification={notifyMock}
        activeFanTab={2}
      />
    );

    const calculateBtn = screen.getByText('Calculate AI-Optimized Walking Route');
    fireEvent.click(calculateBtn);

    // Verify it loads and displays results
    await waitFor(() => {
      expect(screen.getByText('Optimized via Elevator 2 avoiding stairs.')).toBeInTheDocument();
    });
    expect(screen.getByText('Walk 10m north')).toBeInTheDocument();
    expect(screen.getByText(/7 mins/i)).toBeInTheDocument();
    expect(screen.getByText(/250m/i)).toBeInTheDocument();
  });

  it('tests routing api fallback logic when fetch fails', async () => {
    const addIncidentMock = vi.fn();
    const notifyMock = vi.fn();

    // Mock fetch failure
    globalThis.fetch = vi.fn().mockImplementation(() => Promise.reject(new Error('Network offline')));

    render(
      <FanApp
        state={MOCK_STADIUM_STATE}
        addIncident={addIncidentMock}
        addSystemNotification={notifyMock}
        activeFanTab={2}
      />
    );

    const calculateBtn = screen.getByText('Calculate AI-Optimized Walking Route');
    fireEvent.click(calculateBtn);

    // Expecting local offline fallback content to be loaded
    await waitFor(() => {
      expect(screen.getByText(/Bypassing the central food court bottleneck/i)).toBeInTheDocument();
    });
    expect(screen.getByText(/Depart from Gate A/i)).toBeInTheDocument();
  });

  it('tests accessibility request workflow and incident logging', async () => {
    const addIncidentMock = vi.fn();
    const notifyMock = vi.fn();

    render(
      <FanApp
        state={MOCK_STADIUM_STATE}
        addIncident={addIncidentMock}
        addSystemNotification={notifyMock}
        activeFanTab={3}
      />
    );

    const requestHelpBtn = screen.getByText('Dispatch Mobility Assistant');
    fireEvent.click(requestHelpBtn);

    // Should create a high-priority accessibility incident
    expect(addIncidentMock).toHaveBeenCalled();
    const loggedIncident = addIncidentMock.mock.calls[0][0];
    expect(loggedIncident.priority).toBe('High');
    expect(loggedIncident.category).toBe('Accessibility');
    expect(loggedIncident.location).toBe('Gate C Entrance');

    // System notification triggered
    expect(notifyMock).toHaveBeenCalledWith('Wheelchair Assistance Request logged. Volunteer Carlos Ramos has been alerted.', 'success');

    // Renders custom dispatch message in the widget
    expect(screen.getByText('Request Sent to Dispatch')).toBeInTheDocument();
  });

  it('tests AI Chat client with mock server response and offline mode', async () => {
    const addIncidentMock = vi.fn();
    const notifyMock = vi.fn();

    // Mock chat API response
    setupFetchMock({ text: 'The nearest recycling bins are located next to Kiosk 4.' });

    const { container } = render(
      <FanApp
        state={MOCK_STADIUM_STATE}
        addIncident={addIncidentMock}
        addSystemNotification={notifyMock}
        activeFanTab={4}
      />
    );

    const chatInput = screen.getByPlaceholderText(/Ask anything/i);
    fireEvent.change(chatInput, { target: { value: 'Where is recycling?' } });

    const sendBtn = container.querySelector('.lucide-send')?.closest('button')!;
    fireEvent.click(sendBtn);

    await waitFor(() => {
      expect(screen.getByText('The nearest recycling bins are located next to Kiosk 4.')).toBeInTheDocument();
    });
  });

  it('tests high contrast accessibility style updates', () => {
    const addIncidentMock = vi.fn();
    const notifyMock = vi.fn();

    const { container } = render(
      <FanApp
        state={MOCK_STADIUM_STATE}
        addIncident={addIncidentMock}
        addSystemNotification={notifyMock}
        activeFanTab={3}
      />
    );

    const contrastBtn = screen.getByText('High Contrast');
    const outerDiv = container.querySelector('#fan-portal')!;
    
    expect(outerDiv.className).not.toContain('contrast-125');

    fireEvent.click(contrastBtn);
    expect(outerDiv.className).toContain('contrast-125');
  });
});
