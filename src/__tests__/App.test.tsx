import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from '../App';

describe('App main shell and coordinator', () => {
  it('renders application title and initial dashboard correctly', () => {
    render(<App />);

    expect(screen.getByText('Stadium Digital Command Center')).toBeInTheDocument();
    expect(screen.getByText('Interactive Story Tour Walkthrough')).toBeInTheDocument();
    expect(screen.getByText(/1. Supporters Arrive/)).toBeInTheDocument();
  });

  it('allows toggling between dark and light themes', () => {
    render(<App />);

    // Open settings panel
    const settingsBtn = screen.getByRole('button', { name: /Settings/i });
    fireEvent.click(settingsBtn);

    // Find "Perfect Light" button
    const lightBtn = screen.getByRole('button', { name: /Perfect Light/i });
    fireEvent.click(lightBtn);
    expect(window.document.documentElement.classList.contains('light')).toBe(true);

    // Find "Pure Dark" button
    const darkBtn = screen.getByRole('button', { name: /Pure Dark/i });
    fireEvent.click(darkBtn);
    expect(window.document.documentElement.classList.contains('light')).toBe(false);
  });

  it('changes active roles and states when selecting walkthrough steps', () => {
    render(<App />);

    // Step 1: Supporters Arrive (role: fan)
    expect(screen.getByText('Arena Telemetry Map & Occupancy')).toBeInTheDocument(); // Fan/Tour dashboard elements should render

    // Move to Step 5: Sudden Thunderstorm (role: organizer)
    const tourBanner = document.getElementById('demo-tour-banner');
    expect(tourBanner).toBeInTheDocument();
    
    // Click 4 times to reach step 5
    for (let i = 0; i < 4; i++) {
      const btn = document.getElementById('demo-tour-banner')?.querySelector('button.bg-teal-500');
      expect(btn).toBeInTheDocument();
      if (btn) {
        fireEvent.click(btn);
      }
    }

    expect(screen.getByText('5 / 8')).toBeInTheDocument();
    expect(screen.getByText(/Arena Telemetry Map/i)).toBeInTheDocument(); // Organizer dashboard elements should render
  });

  it('triggers guidebook modal display and closure', async () => {
    render(<App />);

    // Open settings panel
    const settingsBtn = screen.getByRole('button', { name: /Settings/i });
    fireEvent.click(settingsBtn);

    // Guidebook button
    const guideBtn = screen.getByRole('button', { name: /Open App Guidebook/i });
    fireEvent.click(guideBtn);

    await waitFor(() => expect(screen.getByText(/Stadium Command Center — Operations Guidebook/i)).toBeInTheDocument());

    const closeButtons = screen.getAllByRole('button', { name: /Close/i });
    fireEvent.click(closeButtons[0]);

    expect(screen.queryByText(/Stadium Command Center — Operations Guidebook/i)).not.toBeInTheDocument();
  });

  it('requires a password check when manually requesting access to protected portals', async () => {
    render(<App />);

    // Open settings panel
    const settingsBtn = screen.getByRole('button', { name: /Settings/i });
    fireEvent.click(settingsBtn);

    expect(screen.getByText('System Preferences')).toBeInTheDocument();

    // Try to switch to Organizer role
    const orgRoleBtn = screen.getByText('Organizer Cockpit');
    fireEvent.click(orgRoleBtn);

    expect(screen.getByText('Enter Password for Organizer')).toBeInTheDocument();

    // Enter incorrect password
    const passwordInput = screen.getByPlaceholderText('Enter "organizer"');
    fireEvent.change(passwordInput, { target: { value: 'wrong-pass' } });

    const authForm = passwordInput.closest('form');
    if (authForm) {
      fireEvent.submit(authForm);
    } else {
      const authSubmit = screen.getByRole('button', { name: /Verify/i });
      fireEvent.click(authSubmit);
    }

    expect(screen.getByText(/Incorrect password/i)).toBeInTheDocument();

    // Enter correct password
    fireEvent.change(passwordInput, { target: { value: 'organizer' } });
    if (authForm) {
      fireEvent.submit(authForm);
    } else {
      const authSubmit = screen.getByRole('button', { name: /Verify/i });
      fireEvent.click(authSubmit);
    }

    // Access granted! Password section closes
    await waitFor(() => {
      expect(screen.queryByText('Enter Password for Organizer')).not.toBeInTheDocument();
    });
  });
});
