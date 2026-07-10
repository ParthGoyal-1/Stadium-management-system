import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import VolunteerActiveTaskPanel from '../components/VolunteerActiveTaskPanel';
import { MOCK_INCIDENT } from './mocks';

describe('VolunteerActiveTaskPanel', () => {
  it('renders idle status when no incidents are assigned', () => {
    render(
      <VolunteerActiveTaskPanel
        myAssignedIncidents={[]}
        resolutionNotes=""
        setResolutionNotes={vi.fn()}
        onResolveTask={vi.fn()}
      />
    );

    expect(screen.getByText(/You do not have any active dispatches right now/i)).toBeInTheDocument();
  });

  it('renders active incident details and lets volunteer submit resolution notes', () => {
    const setResolutionNotesMock = vi.fn();
    const onResolveTaskMock = vi.fn();
    const assignedIncident = { ...MOCK_INCIDENT, status: 'Dispatched' as const, assignedVolunteerId: 'vol-1' };

    render(
      <VolunteerActiveTaskPanel
        myAssignedIncidents={[assignedIncident]}
        resolutionNotes="Fixed the leak"
        setResolutionNotes={setResolutionNotesMock}
        onResolveTask={onResolveTaskMock}
      />
    );

    expect(screen.getByText('Your Assigned Dispatch Task')).toBeInTheDocument();
    expect(screen.getByText('Water leak near section 12')).toBeInTheDocument();
    expect(screen.getByText('East Sector')).toBeInTheDocument();

    const textarea = screen.getByPlaceholderText(/Describe steps taken/i);
    expect(textarea).toHaveValue('Fixed the leak');

    fireEvent.change(textarea, { target: { value: 'Isolated valve' } });
    expect(setResolutionNotesMock).toHaveBeenCalledWith('Isolated valve');

    const submitBtn = screen.getByText('Resolve Incident & Log to Command');
    fireEvent.click(submitBtn);
    expect(onResolveTaskMock).toHaveBeenCalledWith('inc-1');
  });
});
