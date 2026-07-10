import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import StadiumVisualizer from '../components/StadiumVisualizer';
import { MOCK_STADIUM_STATE } from './mocks';

describe('StadiumVisualizer', () => {
  it('renders live arena telemetry header and sectors', () => {
    render(
      <StadiumVisualizer
        state={MOCK_STADIUM_STATE}
        selectedSectorId={null}
        onSelectSector={vi.fn()}
        selectedGateId={null}
        onSelectGate={vi.fn()}
      />
    );

    expect(screen.getByText('Live Arena Telemetry')).toBeInTheDocument();
    expect(screen.getByText('NORTH')).toBeInTheDocument();
    expect(screen.getByText('EAST')).toBeInTheDocument();
    expect(screen.getByText('SOUTH')).toBeInTheDocument();
    expect(screen.getByText('WEST')).toBeInTheDocument();
  });

  it('triggers onSelectSector when clicking a sector path', () => {
    const onSelectSectorMock = vi.fn();
    const { container } = render(
      <StadiumVisualizer
        state={MOCK_STADIUM_STATE}
        selectedSectorId={null}
        onSelectSector={onSelectSectorMock}
        selectedGateId={null}
        onSelectGate={vi.fn()}
      />
    );

    const path = container.querySelector('path.cursor-pointer')!;
    fireEvent.click(path); // first sector path (North)
    expect(onSelectSectorMock).toHaveBeenCalled();
  });

  it('triggers onSelectGate when clicking gate selectors', () => {
    const onSelectGateMock = vi.fn();
    render(
      <StadiumVisualizer
        state={MOCK_STADIUM_STATE}
        selectedSectorId={null}
        onSelectSector={vi.fn()}
        selectedGateId={null}
        onSelectGate={onSelectGateMock}
      />
    );

    const gateBtn = screen.getByText('A');
    fireEvent.click(gateBtn);
    expect(onSelectGateMock).toHaveBeenCalledWith('gate-a');
  });
});
