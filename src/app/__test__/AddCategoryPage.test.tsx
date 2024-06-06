/**
 * @jest-environment jsdom
*/

import { render, screen, fireEvent} from '@testing-library/react';
import AddCategoryPage from '../addcategory/page';
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

describe('AddCategoryPage', () => {
  test('renders Add New Category heading', () => {
    render(<AddCategoryPage />);
    const headingElement = screen.getByText('Add New Category');
    expect(headingElement).toBeInTheDocument();
  });

  test('renders form elements', () => {
    render(<AddCategoryPage />);
    const formElements = screen.getAllByRole('textbox');
    expect(formElements).toHaveLength(3); // title, desc, slug

    const colorInput = screen.getByLabelText('Description');
    expect(colorInput).toBeInTheDocument();

    const fileInput = screen.getByLabelText('Upload Image');
    expect(fileInput).toBeInTheDocument();

    const submitButton = screen.getByRole('button', { name: 'Submit' });
    expect(submitButton).toBeInTheDocument();
  });

  test('renders error message for empty title field', () => {
    render(<AddCategoryPage />);
    const titleInput = screen.getByLabelText('Title');
    const submitButton = screen.getByRole('button', { name: 'Submit' });

    fireEvent.change(titleInput, { target: { value: '' } });
    fireEvent.click(submitButton);

    const errorMessage = screen.getByText('Title');
    expect(errorMessage).toBeInTheDocument();
  });

  test('renders error message for empty slug field', () => {
    render(<AddCategoryPage />);
    const slugInput = screen.getByLabelText('Slug');
    const submitButton = screen.getByRole('button', { name: 'Submit' });

    fireEvent.change(slugInput, { target: { value: '' } });
    fireEvent.click(submitButton);

    const errorMessage = screen.getByText('Slug');
    expect(errorMessage).toBeInTheDocument();
  });

});