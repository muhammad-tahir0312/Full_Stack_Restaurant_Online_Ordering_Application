/**
 * @jest-environment jsdom
 */

import { render, screen, fireEvent} from '@testing-library/react';
import AddPage from '../add/page';
import { useRouter } from 'next/navigation';
import React from 'react';

// Mock the useRouter hook
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Provide a mock implementation for useRouter
(useRouter as jest.Mock).mockReturnValue({
  route: '/',
  pathname: '/',
  query: {},
  asPath: '',
  push: jest.fn(),
  prefetch: jest.fn(),
  replace: jest.fn(),
  reload: jest.fn(),
  back: jest.fn(),
  beforePopState: jest.fn(),
  events: {
    on: jest.fn(),
    off: jest.fn(),
    emit: jest.fn(),
  },
  isFallback: false,
});

// Mock the fetch function
global.fetch = jest.fn().mockResolvedValue({
  json: jest.fn().mockResolvedValue([]),
});

describe('AddPage', () => {
  test('renders Add New Product heading', () => {
    render(<AddPage />);
    const headingElement = screen.getByText('Add New Product');
    expect(headingElement).toBeInTheDocument();
  });

  test('renders form elements', () => {
    render(<AddPage />);
    const formElements = screen.getAllByRole('textbox');
    expect(formElements).toHaveLength(5); // title, desc, price, catSlug

    const selectElement = screen.getByRole('combobox');
    expect(selectElement).toBeInTheDocument();

    const fileInput = screen.getByLabelText('Upload Image');
    expect(fileInput).toBeInTheDocument();

    const submitButton = screen.getByRole('button', { name: 'Submit' });
    expect(submitButton).toBeInTheDocument();
  });

  test('renders error message for empty price field', () => {
    render(<AddPage />);
    const priceInput = screen.getByLabelText('Price');
    const submitButton = screen.getByRole('button', { name: 'Submit' });

    fireEvent.change(priceInput, { target: { value: '' } });
    fireEvent.click(submitButton);

    const errorMessage = screen.getByText('Price');
    expect(errorMessage).toBeInTheDocument();
  });

  test('renders error message for empty category field', () => {
    render(<AddPage />);
    const categorySelect = screen.getByRole('combobox');
    const submitButton = screen.getByRole('button', { name: 'Submit' });

    fireEvent.change(categorySelect, { target: { value: '' } });
    fireEvent.click(submitButton);

    const errorMessage = screen.getByText('Category');
    expect(errorMessage).toBeInTheDocument();
  });
});