import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Card } from './Card';

// Mock CSS classes since we're not loading them in the test environment
vi.mock('./Card.css', () => ({}));

describe('Card', () => {
  it('renders children correctly', () => {
    render(
      <Card>
        <p>Test content</p>
      </Card>
    );
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('renders title when provided', () => {
    render(
      <Card title="Test Title">
        <p>Test content</p>
      </Card>
    );
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <Card className="custom-class">
        <p>Test content</p>
      </Card>
    );
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('renders without title', () => {
    const { container } = render(
      <Card>
        <p>Test content</p>
      </Card>
    );
    expect(container.querySelector('h3')).not.toBeInTheDocument();
  });
});
