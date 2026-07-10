import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import LiveTelemetryStream from '../components/LiveTelemetryStream';
import { MOCK_STADIUM_STATE } from './mocks';

describe('LiveTelemetryStream', () => {
  it('renders correctly and shows initial logs', () => {
    const notifyMock = vi.fn();
    render(
      <LiveTelemetryStream
        state={MOCK_STADIUM_STATE}
        activeStepId={1}
        addSystemNotification={notifyMock}
      />
    );

    expect(screen.getByText('Live Telemetry & Event Stream')).toBeInTheDocument();
    expect(screen.getByText('Ticket Scan Velocity')).toBeInTheDocument();
    expect(screen.getByText('Cumulative Ingests')).toBeInTheDocument();
  });

  it('allows pausing and playing telemetry feed', () => {
    const notifyMock = vi.fn();
    render(
      <LiveTelemetryStream
        state={MOCK_STADIUM_STATE}
        activeStepId={1}
        addSystemNotification={notifyMock}
      />
    );

    const toggleBtn = screen.getByRole('button', { name: /Live Ingesting/i });
    fireEvent.click(toggleBtn);

    // Should toggle button text to Resume Stream
    expect(screen.getByRole('button', { name: /Resume Stream/i })).toBeInTheDocument();

    // Toggle back
    fireEvent.click(screen.getByRole('button', { name: /Resume Stream/i }));
    expect(screen.getByRole('button', { name: /Live Ingesting/i })).toBeInTheDocument();
  });
});
