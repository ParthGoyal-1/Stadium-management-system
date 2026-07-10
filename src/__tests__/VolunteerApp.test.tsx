import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import VolunteerApp from '../components/VolunteerApp';
import { MOCK_STADIUM_STATE, setupFetchMock } from './mocks';

describe('VolunteerApp Workspace', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    globalThis.fetch = undefined as any;
  });

  it('renders all volunteer panels correctly', () => {
    render(
      <VolunteerApp
        state={MOCK_STADIUM_STATE}
        onUpdateVolunteerStatus={vi.fn()}
        onResolveIncident={vi.fn()}
        onAddIncident={vi.fn()}
        addSystemNotification={vi.fn()}
      />
    );

    expect(screen.getByText('Carlos Ramos')).toBeInTheDocument();
    expect(screen.getByText('AI-Classified Incident Logger')).toBeInTheDocument();
    expect(screen.getByText('AI Volunteer Copilot')).toBeInTheDocument();
  });

  it('allows volunteer to claim an unassigned task from the queue', () => {
    const onUpdateVolunteerStatusMock = vi.fn();
    const addSystemNotificationMock = vi.fn();

    render(
      <VolunteerApp
        state={MOCK_STADIUM_STATE}
        onUpdateVolunteerStatus={onUpdateVolunteerStatusMock}
        onResolveIncident={vi.fn()}
        onAddIncident={vi.fn()}
        addSystemNotification={addSystemNotificationMock}
      />
    );

    const claimBtn = screen.getByRole('button', { name: /Accept & Dispatch|Claim Ticket/i });
    fireEvent.click(claimBtn);

    expect(onUpdateVolunteerStatusMock).toHaveBeenCalledWith('vol-1', 'Busy');
    expect(addSystemNotificationMock).toHaveBeenCalledWith(expect.stringContaining('You claimed task:'), 'success');
  });

  it('submits a new incident report to AI classifier and handles successful classification', async () => {
    const onAddIncidentMock = vi.fn();
    const addSystemNotificationMock = vi.fn();

    const mockClassificationResult = {
      priority: 'High',
      category: 'Medical',
      resolutionSteps: ['Contact safety team', 'Locate defibrillator'],
      summaryReport: 'Clear Section South Row 12.'
    };

    setupFetchMock(mockClassificationResult);

    render(
      <VolunteerApp
        state={MOCK_STADIUM_STATE}
        onUpdateVolunteerStatus={vi.fn()}
        onResolveIncident={vi.fn()}
        onAddIncident={onAddIncidentMock}
        addSystemNotification={addSystemNotificationMock}
      />
    );

    const textarea = screen.getByPlaceholderText(/Examples: 'Faint supporter row 4 in/i);
    fireEvent.change(textarea, { target: { value: 'Severe asthma attack' } });

    const submitBtn = screen.getByText('File Incident with AI Auto-Classification');
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(onAddIncidentMock).toHaveBeenCalled();
    });

    const loggedIncident = onAddIncidentMock.mock.calls[0][0];
    expect(loggedIncident.description).toBe('Severe asthma attack');
    expect(loggedIncident.priority).toBe('High');
    expect(loggedIncident.category).toBe('Medical');

    expect(addSystemNotificationMock).toHaveBeenCalledWith(
      'Incident filed: [High] Medical',
      'alert'
    );
  });

  it('handles offline fallback when reporting incident fails', async () => {
    const onAddIncidentMock = vi.fn();
    const addSystemNotificationMock = vi.fn();

    // Mock network failure
    globalThis.fetch = vi.fn().mockImplementation(() => Promise.reject(new Error('Disconnected')));

    render(
      <VolunteerApp
        state={MOCK_STADIUM_STATE}
        onUpdateVolunteerStatus={vi.fn()}
        onResolveIncident={vi.fn()}
        onAddIncident={onAddIncidentMock}
        addSystemNotification={addSystemNotificationMock}
      />
    );

    const textarea = screen.getByPlaceholderText(/Examples: 'Faint supporter row 4 in/i);
    fireEvent.change(textarea, { target: { value: 'Slippery stairs' } });

    const submitBtn = screen.getByText('File Incident with AI Auto-Classification');
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(onAddIncidentMock).toHaveBeenCalled();
    });

    // Renders the local offline fallback classification
    const loggedIncident = onAddIncidentMock.mock.calls[0][0];
    expect(loggedIncident.description).toBe('Slippery stairs');
    expect(loggedIncident.priority).toBe('Medium'); // offline default
  });

  it('sends copilot chat messages and displays simulated replies', async () => {
    setupFetchMock({ text: 'Ensure the patient is kept warm while medical team arrives.' });

    const { container } = render(
      <VolunteerApp
        state={MOCK_STADIUM_STATE}
        onUpdateVolunteerStatus={vi.fn()}
        onResolveIncident={vi.fn()}
        onAddIncident={vi.fn()}
        addSystemNotification={vi.fn()}
      />
    );

    const chatInput = screen.getByPlaceholderText(/Ask Copilot/i);
    fireEvent.change(chatInput, { target: { value: 'First aid for fainting' } });

    const sendBtn = container.querySelector('.lucide-send')?.closest('button')!;
    fireEvent.click(sendBtn);

    await waitFor(() => {
      expect(screen.getByText('Ensure the patient is kept warm while medical team arrives.')).toBeInTheDocument();
    });
  });

  it('allows volunteer to resolve their active task with resolution notes', () => {
    const onResolveIncidentMock = vi.fn();
    const busyState = {
      ...MOCK_STADIUM_STATE,
      incidents: [
        {
          id: 'inc-active-1',
          description: 'Spill on staircase 4',
          location: 'Gate C Entrance',
          priority: 'Medium' as const,
          status: 'Dispatched' as const,
          assignedVolunteerId: 'vol-1',
          timestamp: '19:40',
          category: 'Facility'
        }
      ]
    };

    render(
      <VolunteerApp
        state={busyState}
        onUpdateVolunteerStatus={vi.fn()}
        onResolveIncident={onResolveIncidentMock}
        onAddIncident={vi.fn()}
        addSystemNotification={vi.fn()}
      />
    );

    const notesTextarea = screen.getByPlaceholderText(/Describe steps taken/i);
    fireEvent.change(notesTextarea, { target: { value: 'Mopped the spill and set warning cones.' } });

    const resolveBtn = screen.getByText('Resolve Incident & Log to Command');
    fireEvent.click(resolveBtn);

    expect(onResolveIncidentMock).toHaveBeenCalledWith('inc-active-1', 'Mopped the spill and set warning cones.');
  });
});
