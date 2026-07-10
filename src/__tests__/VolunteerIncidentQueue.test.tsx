import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import VolunteerIncidentQueue from '../components/VolunteerIncidentQueue';
import { MOCK_INCIDENT } from './mocks';

describe('VolunteerIncidentQueue', () => {
  it('renders "No open incidents" when queue is empty', () => {
    render(
      <VolunteerIncidentQueue
        openAlertPool={[]}
        onClaimTask={vi.fn()}
      />
    );

    expect(screen.getByText('🟢 No open unassigned alarms in the sector queue.')).toBeInTheDocument();
  });

  it('renders open incidents and triggers onClaimTask when clicked', () => {
    const onClaimTaskMock = vi.fn();
    const mockIncidents = [
      MOCK_INCIDENT,
      { ...MOCK_INCIDENT, id: 'inc-2', description: 'Lost wallet near Gate A', priority: 'Low' as const }
    ];

    render(
      <VolunteerIncidentQueue
        openAlertPool={mockIncidents}
        onClaimTask={onClaimTaskMock}
      />
    );

    expect(screen.getByText('Water leak near section 12')).toBeInTheDocument();
    expect(screen.getByText('Lost wallet near Gate A')).toBeInTheDocument();

    const claimButtons = screen.getAllByRole('button', { name: /Accept & Dispatch|Claim Ticket/i });
    expect(claimButtons).toHaveLength(2);

    fireEvent.click(claimButtons[0]);
    expect(onClaimTaskMock).toHaveBeenCalledWith('inc-1');
  });
});
