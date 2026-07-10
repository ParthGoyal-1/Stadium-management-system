import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import OrganizerDashboard from '../components/OrganizerDashboard';
import { MOCK_STADIUM_STATE, setupFetchMock } from './mocks';

describe('OrganizerDashboard Console', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    globalThis.fetch = undefined as any;
  });

  it('renders overall simulation engine and active queue correctly', () => {
    const presetMock = vi.fn();
    const resolveMock = vi.fn();
    const statusMock = vi.fn();
    const notifyMock = vi.fn();

    render(
      <OrganizerDashboard
        state={MOCK_STADIUM_STATE}
        onSelectPreset={presetMock}
        activePresetIndex={0}
        onResolveIncident={resolveMock}
        onUpdateVolunteerStatus={statusMock}
        addSystemNotification={notifyMock}
        activeSection={2}
      />
    );

    expect(screen.getByText('Live Scenario Simulation Engine')).toBeInTheDocument();
    expect(screen.getByText('Event-Aware Proactive Alert System')).toBeInTheDocument();
    expect(screen.getByText('Incidents Command Desk')).toBeInTheDocument();
    expect(screen.getByText('Water leak near section 12')).toBeInTheDocument();
  });

  it('triggers What-If simulation prediction states on Predictive Analytics section', async () => {
    const presetMock = vi.fn();
    const notifyMock = vi.fn();

    const { container } = render(
      <OrganizerDashboard
        state={MOCK_STADIUM_STATE}
        onSelectPreset={presetMock}
        activePresetIndex={0}
        onResolveIncident={vi.fn()}
        onUpdateVolunteerStatus={vi.fn()}
        addSystemNotification={notifyMock}
        activeSection={3}
      />
    );

    expect(screen.getByText("Predictive Decision 'What-If' Simulation")).toBeInTheDocument();
    
    const select = container.querySelector('select')!;
    fireEvent.change(select, { target: { value: 'What happens if Gate A closes for 10 minutes?' } });

    const runBtn = screen.getByText('Run Simulation Model');
    fireEvent.click(runBtn);

    // Verify it loads and displays results
    await waitFor(() => {
      expect(screen.getByText('Simulated Contingency Output Summary')).toBeInTheDocument();
    }, { timeout: 3000 });

    expect(screen.getByText(/420 people backing up/i)).toBeInTheDocument();
    expect(screen.getByText('94%')).toBeInTheDocument(); // Confidence score
  });

  it('triggers custom Match Event simulation plans', async () => {
    const notifyMock = vi.fn();
    
    render(
      <OrganizerDashboard
        state={MOCK_STADIUM_STATE}
        onSelectPreset={vi.fn()}
        activePresetIndex={0}
        onResolveIncident={vi.fn()}
        onUpdateVolunteerStatus={vi.fn()}
        addSystemNotification={notifyMock}
        activeSection={2}
      />
    );

    const goalBtn = screen.getByText(/Argentina Scores/i);
    fireEvent.click(goalBtn);

    await waitFor(() => {
      expect(screen.getByText('Match Alert Model: Argentina Scores a Goal!')).toBeInTheDocument();
    }, { timeout: 3000 });

    expect(screen.getByText(/Spike/i)).toBeInTheDocument();
    expect(notifyMock).toHaveBeenCalledWith('Proactive forecast computed for event: Argentina Scores! (Goal Scored)', 'info');
  });

  it('triggers environmental weather scenario presets', () => {
    const presetMock = vi.fn();
    const notifyMock = vi.fn();

    render(
      <OrganizerDashboard
        state={MOCK_STADIUM_STATE}
        onSelectPreset={presetMock}
        activePresetIndex={0}
        onResolveIncident={vi.fn()}
        onUpdateVolunteerStatus={vi.fn()}
        addSystemNotification={notifyMock}
        activeSection={2}
      />
    );

    const weatherBtn = screen.getByText('Sudden Thunderstorm');
    fireEvent.click(weatherBtn);

    expect(presetMock).toHaveBeenCalledWith(1); // Sudden Thunderstorm is index 1 in simulation presets
    expect(notifyMock).toHaveBeenCalledWith('Scenario loaded: Sudden Thunderstorm', 'info');
  });

  it('generates safety announcement scripts for active incidents', async () => {
    const notifyMock = vi.fn();
    setupFetchMock({ text: 'Attention fans: Please use Alternative Corridor B near Section 12.' });

    render(
      <OrganizerDashboard
        state={MOCK_STADIUM_STATE}
        onSelectPreset={vi.fn()}
        activePresetIndex={0}
        onResolveIncident={vi.fn()}
        onUpdateVolunteerStatus={vi.fn()}
        addSystemNotification={notifyMock}
        activeSection={2}
      />
    );

    const paBtn = screen.getByRole('button', { name: 'PA Script' });
    fireEvent.click(paBtn);

    await waitFor(() => {
      expect(screen.getByText(/Attention fans/i)).toBeInTheDocument();
    });

    expect(notifyMock).toHaveBeenCalledWith('PA script drafted by AI.', 'info');
  });

  it('supports resolving active safety incidents directly', () => {
    const resolveMock = vi.fn();
    const notifyMock = vi.fn();

    render(
      <OrganizerDashboard
        state={MOCK_STADIUM_STATE}
        onSelectPreset={vi.fn()}
        activePresetIndex={0}
        onResolveIncident={resolveMock}
        onUpdateVolunteerStatus={vi.fn()}
        addSystemNotification={notifyMock}
        activeSection={2}
      />
    );

    const clearBtn = screen.getByRole('button', { name: 'Clear' });
    fireEvent.click(clearBtn);

    expect(resolveMock).toHaveBeenCalledWith('inc-1', 'Resolved by Command supervisor after clearing site safety inspections.');
    expect(notifyMock).toHaveBeenCalledWith('Incident resolved by Organizer.', 'success');
  });
});
