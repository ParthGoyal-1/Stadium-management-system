import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import VolunteerCopilotChat from '../components/VolunteerCopilotChat';
import { ChatMessage } from '../types';

describe('VolunteerCopilotChat', () => {
  const mockHistory: ChatMessage[] = [
    { id: '1', sender: 'user', text: 'Hi copilot', timestamp: '12:00' },
    { id: '2', sender: 'ai', text: 'Hello volunteer Carlos, how can I assist you with your duties?', timestamp: '12:01' }
  ];

  it('renders chat history messages correctly', () => {
    render(
      <VolunteerCopilotChat
        volChatInput=""
        setVolChatInput={vi.fn()}
        volChatHistory={mockHistory}
        loadingVolChat={false}
        onSendVolChat={vi.fn()}
      />
    );

    expect(screen.getByText('Hi copilot')).toBeInTheDocument();
    expect(screen.getByText('Hello volunteer Carlos, how can I assist you with your duties?')).toBeInTheDocument();
  });

  it('updates text when clicking quick FAQ button suggestion', () => {
    const setVolChatInputMock = vi.fn();

    render(
      <VolunteerCopilotChat
        volChatInput=""
        setVolChatInput={setVolChatInputMock}
        volChatHistory={[]}
        loadingVolChat={false}
        onSendVolChat={vi.fn()}
      />
    );

    const quickButton = screen.getByText(/Flares Protocol\?/i);
    fireEvent.click(quickButton);

    expect(setVolChatInputMock).toHaveBeenCalledWith('What is the protocol for active flares in Section South?');
  });

  it('displays loading indicator when loadingVolChat is true', () => {
    render(
      <VolunteerCopilotChat
        volChatInput=""
        setVolChatInput={vi.fn()}
        volChatHistory={[]}
        loadingVolChat={true}
        onSendVolChat={vi.fn()}
      />
    );

    expect(screen.getByText(/Volunteer Copilot is retrieving/i)).toBeInTheDocument();
  });

  it('triggers onSendVolChat when pressing Enter key or clicking send', () => {
    const onSendVolChatMock = vi.fn();
    const setVolChatInputMock = vi.fn();

    const { container } = render(
      <VolunteerCopilotChat
        volChatInput="My custom message"
        setVolChatInput={setVolChatInputMock}
        volChatHistory={[]}
        loadingVolChat={false}
        onSendVolChat={onSendVolChatMock}
      />
    );

    const input = screen.getByPlaceholderText(/Ask Copilot/i);
    expect(input).toHaveValue('My custom message');

    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    expect(onSendVolChatMock).toHaveBeenCalled();

    const sendButton = container.querySelector('.lucide-send')?.closest('button')!;
    fireEvent.click(sendButton);
    expect(onSendVolChatMock).toHaveBeenCalledTimes(2);
  });
});
