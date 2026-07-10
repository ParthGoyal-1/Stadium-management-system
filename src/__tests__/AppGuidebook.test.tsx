import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import AppGuidebook from '../components/AppGuidebook';

describe('AppGuidebook', () => {
  it('returns null if isOpen is false', () => {
    const { container } = render(<AppGuidebook isOpen={false} onClose={vi.fn()} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders modal content when isOpen is true and lets user close it', () => {
    const onCloseMock = vi.fn();
    render(<AppGuidebook isOpen={true} onClose={onCloseMock} />);

    expect(screen.getByText('Stadium Command Center — Operations Guidebook')).toBeInTheDocument();
    
    const closeButtons = screen.getAllByRole('button', { name: /Close/i });
    expect(closeButtons.length).toBeGreaterThan(0);

    fireEvent.click(closeButtons[0]);
    expect(onCloseMock).toHaveBeenCalled();
  });

  it('allows navigating tabs inside the guidebook', () => {
    render(<AppGuidebook isOpen={true} onClose={vi.fn()} />);

    // Click 2. Supporter App tab
    const supporterTab = screen.getByText('2. Supporter App');
    fireEvent.click(supporterTab);

    expect(screen.getByText('Supporter Portal (Fan App Features)')).toBeInTheDocument();

    // Click 3. Volunteer Portal tab
    const volunteerTab = screen.getByText('3. Volunteer Portal');
    fireEvent.click(volunteerTab);

    expect(screen.getByText('Volunteer Portal (Ground Staff Tools)')).toBeInTheDocument();
  });
});
