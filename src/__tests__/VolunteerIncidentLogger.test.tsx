import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import VolunteerIncidentLogger from '../components/VolunteerIncidentLogger';

describe('VolunteerIncidentLogger', () => {
  it('renders input elements and handles typing', () => {
    const setReportedLocationMock = vi.fn();
    const setReportTextMock = vi.fn();
    const onReportIncidentMock = vi.fn();

    render(
      <VolunteerIncidentLogger
        reportedLocation="Sector East, Section 202"
        setReportedLocation={setReportedLocationMock}
        reportText="Faint supporter"
        setReportText={setReportTextMock}
        isReporting={false}
        onReportIncident={onReportIncidentMock}
        recentReportResult={null}
      />
    );

    expect(screen.getByText('AI-Classified Incident Logger')).toBeInTheDocument();
    
    const textarea = screen.getByPlaceholderText(/Examples: 'Faint supporter row 4 in Sector South'/i);
    expect(textarea).toHaveValue('Faint supporter');

    fireEvent.change(textarea, { target: { value: 'Water leak' } });
    expect(setReportTextMock).toHaveBeenCalledWith('Water leak');

    const button = screen.getByText('File Incident with AI Auto-Classification');
    fireEvent.click(button);
    expect(onReportIncidentMock).toHaveBeenCalled();
  });

  it('renders recent report result correctly', () => {
    const recentReportResultMock = {
      priority: 'High',
      category: 'Medical',
      resolutionSteps: [
        'Isolate the incident area',
        'Contact nearest first-aid crew'
      ],
      summaryReport: 'Attention in the stadium, please remain calm.'
    };

    render(
      <VolunteerIncidentLogger
        reportedLocation="Sector East, Section 202"
        setReportedLocation={vi.fn()}
        reportText="Slipped fan"
        setReportText={vi.fn()}
        isReporting={false}
        onReportIncident={vi.fn()}
        recentReportResult={recentReportResultMock}
      />
    );

    expect(screen.getByText('Incident Classified:')).toBeInTheDocument();
    expect(screen.getByText('High | Medical')).toBeInTheDocument();
    expect(screen.getByText('Isolate the incident area')).toBeInTheDocument();
    expect(screen.getByText('Contact nearest first-aid crew')).toBeInTheDocument();
    expect(screen.getByText(/Attention in the stadium, please remain calm./i)).toBeInTheDocument();
  });
});
