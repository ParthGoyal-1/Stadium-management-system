import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import DemoNarrative from '../components/DemoNarrative';

describe('DemoNarrative', () => {
  it('renders active story step information correctly', () => {
    const onStepChangeMock = vi.fn();
    const onResetDemoMock = vi.fn();

    render(
      <DemoNarrative
        currentStepId={1}
        onStepChange={onStepChangeMock}
        onResetDemo={onResetDemoMock}
      />
    );

    expect(screen.getByText('Interactive Story Tour Walkthrough')).toBeInTheDocument();
    expect(screen.getByText(/1. Supporters Arrive/)).toBeInTheDocument();
    expect(screen.getByText(/Pre-Match Rush begins. Gate A Congested./i)).toBeInTheDocument();
    expect(screen.getByText(/1 \/ 8/)).toBeInTheDocument();
  });

  it('triggers step change and reset actions correctly', () => {
    const onStepChangeMock = vi.fn();
    const onResetDemoMock = vi.fn();

    render(
      <DemoNarrative
        currentStepId={2}
        onStepChange={onStepChangeMock}
        onResetDemo={onResetDemoMock}
      />
    );

    // Test backward step change click
    const restartButton = screen.getByRole('button', { name: /Restart/i });
    fireEvent.click(restartButton);
    expect(onResetDemoMock).toHaveBeenCalled();

    // Get buttons
    const buttons = screen.getAllByRole('button');
    // Button 0 is restart, Button 1 is Left Arrow, Button 2 is Right Arrow
    
    // Click next step button
    fireEvent.click(buttons[2]);
    expect(onStepChangeMock).toHaveBeenCalledWith(3);

    // Click previous step button
    fireEvent.click(buttons[1]);
    expect(onStepChangeMock).toHaveBeenCalledWith(1);
  });
});
