import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import VolunteerProfileShiftControl from '../components/VolunteerProfileShiftControl';
import { MOCK_VOLUNTEER } from './mocks';

describe('VolunteerProfileShiftControl', () => {
  it('renders volunteer profile info correctly', () => {
    const onUpdateStatusMock = vi.fn();
    const addNotificationMock = vi.fn();

    render(
      <VolunteerProfileShiftControl
        volunteer={MOCK_VOLUNTEER}
        onUpdateStatus={onUpdateStatusMock}
        addNotification={addNotificationMock}
      />
    );

    expect(screen.getByText('Carlos Ramos')).toBeInTheDocument();
    expect(screen.getByText('Primary Location:')).toBeInTheDocument();
    expect(screen.getByText('Available')).toBeInTheDocument();
  });

  it('triggers onUpdateStatus and notification when changing status to On Break', () => {
    const onUpdateStatusMock = vi.fn();
    const addNotificationMock = vi.fn();

    render(
      <VolunteerProfileShiftControl
        volunteer={MOCK_VOLUNTEER}
        onUpdateStatus={onUpdateStatusMock}
        addNotification={addNotificationMock}
      />
    );

    const onBreakButton = screen.getByText('On Break');
    fireEvent.click(onBreakButton);

    expect(onUpdateStatusMock).toHaveBeenCalledWith('vol-1', 'On Break');
    expect(addNotificationMock).toHaveBeenCalledWith('Shift status set to On Break', 'info');
  });
});
