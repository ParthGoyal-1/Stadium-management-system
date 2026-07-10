import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import CoAgentCollaborationFlow from '../components/CoAgentCollaborationFlow';

describe('CoAgentCollaborationFlow', () => {
  it('renders default collaboration flow when match event is null and step is 1', () => {
    render(<CoAgentCollaborationFlow activeStepId={1} activeMatchEvent={null} />);

    expect(screen.getByText('Gate Congestion & Fan Redirection Cascade')).toBeInTheDocument();
    expect(screen.getByText('Event Agent')).toBeInTheDocument();
    expect(screen.getByText('Operations Agent')).toBeInTheDocument();
    expect(screen.getByText('Volunteer Agent')).toBeInTheDocument();
  });

  it('renders customized collaboration chain for goal event', () => {
    render(
      <CoAgentCollaborationFlow
        activeStepId={2}
        activeMatchEvent="Argentina Scores! (Goal Scored)"
      />
    );

    expect(screen.getByText('Celebration Spike & Concessions Rush Loop')).toBeInTheDocument();
    expect(screen.getByText('Event / Sec Agent')).toBeInTheDocument();
    expect(screen.getByText('Sustainability Agent')).toBeInTheDocument();
  });

  it('renders customized collaboration chain for Halftime food rush', () => {
    render(
      <CoAgentCollaborationFlow
        activeStepId={3}
        activeMatchEvent="Half Time Food Rush"
      />
    );

    expect(screen.getByText('Halftime Mass Movement Coordination')).toBeInTheDocument();
    expect(screen.getByText(/Predicts Halftime/)).toBeInTheDocument();
  });
});
