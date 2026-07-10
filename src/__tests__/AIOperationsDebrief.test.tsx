import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import AIOperationsDebrief from '../components/AIOperationsDebrief';

describe('AIOperationsDebrief', () => {
  it('renders standard post-event summary dashboard', () => {
    const notifyMock = vi.fn();
    render(
      <AIOperationsDebrief
        activePresetIndex={0}
        activeStepId={1}
        activeMatchEvent={null}
        addSystemNotification={notifyMock}
      />
    );

    expect(screen.getByText('AI Operations Debrief')).toBeInTheDocument();
    expect(screen.getByText('Match Summary - Active Phase Operations')).toBeInTheDocument();
    expect(screen.getByText('52,341')).toBeInTheDocument();
  });

  it('renders different summary metrics depending on selected event preset', () => {
    const notifyMock = vi.fn();
    render(
      <AIOperationsDebrief
        activePresetIndex={2} // Weather Storm Preset
        activeStepId={3}
        activeMatchEvent={null}
        addSystemNotification={notifyMock}
      />
    );

    expect(screen.getByText('Microclimate Storm Mitigation Audit')).toBeInTheDocument();
    expect(screen.getByText('49,812')).toBeInTheDocument();
  });

  it('allows toggling between Executive Summary and Co-Agent Audits tabs', () => {
    const notifyMock = vi.fn();
    render(
      <AIOperationsDebrief
        activePresetIndex={0}
        activeStepId={1}
        activeMatchEvent={null}
        addSystemNotification={notifyMock}
      />
    );

    const analyticsTabButton = screen.getByText('Co-Agent Audits');
    fireEvent.click(analyticsTabButton);

    expect(screen.getByText(/Gate A overflow predicted/i)).toBeInTheDocument();
  });

  it('triggers report regeneration spinner and calls notification', async () => {
    vi.useFakeTimers();
    const notifyMock = vi.fn();
    render(
      <AIOperationsDebrief
        activePresetIndex={0}
        activeStepId={1}
        activeMatchEvent={null}
        addSystemNotification={notifyMock}
      />
    );

    const regenButton = screen.getByText('Recalculate');
    fireEvent.click(regenButton);

    expect(screen.getByText(/AI operations agent processing/i)).toBeInTheDocument();

    // Fast-forward 1.2s to trigger state update
    act(() => {
      vi.advanceTimersByTime(1200);
    });

    expect(notifyMock).toHaveBeenCalledWith('Operations Debrief generated successfully.', 'success');
    expect(screen.queryByText(/AI operations agent processing/i)).not.toBeInTheDocument();
    vi.useRealTimers();
  });
});
