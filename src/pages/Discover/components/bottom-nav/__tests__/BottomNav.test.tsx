import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import BottomNav from '../index';

const mockNavigate = vi.fn();

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock CSS module
vi.mock('../index.module.scss', () => ({
  default: {
    container: 'container',
    content: 'content',
    navItem: 'navItem',
    active: 'active',
    iconWrapper: 'iconWrapper',
    icon: 'icon',
    label: 'label',
    spacer: 'spacer',
  },
}));

describe('BottomNav Component', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('should render all four navigation items correctly', () => {
    render(
      <MemoryRouter initialEntries={['/home']}>
        <BottomNav />
      </MemoryRouter>,
    );

    // Verify all four navigation items are rendered
    expect(screen.getByRole('button', { name: /Home/i })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Explore/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Saved/i })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Profile/i }),
    ).toBeInTheDocument();

    // Verify the container and spacer are rendered
    expect(document.querySelector('.container')).toBeInTheDocument();
    expect(document.querySelector('.spacer')).toBeInTheDocument();
  });

  it('should highlight the correct navigation item based on current path (/home)', () => {
    render(
      <MemoryRouter initialEntries={['/home']}>
        <BottomNav />
      </MemoryRouter>,
    );

    const homeButton = screen.getByRole('button', { name: /Home/i });
    const exploreButton = screen.getByRole('button', { name: /Explore/i });

    expect(homeButton).toHaveClass('active');
    expect(homeButton).toHaveAttribute('aria-current', 'page');
    expect(exploreButton).not.toHaveClass('active');
    expect(exploreButton).not.toHaveAttribute('aria-current', 'page');
  });

  it('should highlight the correct navigation item based on current path (/explore)', () => {
    render(
      <MemoryRouter initialEntries={['/explore']}>
        <BottomNav />
      </MemoryRouter>,
    );

    const exploreButton = screen.getByRole('button', { name: /Explore/i });
    const savedButton = screen.getByRole('button', { name: /Saved/i });

    expect(exploreButton).toHaveClass('active');
    expect(exploreButton).toHaveAttribute('aria-current', 'page');
    expect(savedButton).not.toHaveClass('active');
  });

  it('should highlight the correct navigation item based on current path (/saved)', () => {
    render(
      <MemoryRouter initialEntries={['/saved']}>
        <BottomNav />
      </MemoryRouter>,
    );

    const savedButton = screen.getByRole('button', { name: /Saved/i });
    const profileButton = screen.getByRole('button', { name: /Profile/i });

    expect(savedButton).toHaveClass('active');
    expect(savedButton).toHaveAttribute('aria-current', 'page');
    expect(profileButton).not.toHaveClass('active');
  });

  it('should highlight the correct navigation item based on current path (/profile)', () => {
    render(
      <MemoryRouter initialEntries={['/profile']}>
        <BottomNav />
      </MemoryRouter>,
    );

    const profileButton = screen.getByRole('button', { name: /Profile/i });
    const homeButton = screen.getByRole('button', { name: /Home/i });

    expect(profileButton).toHaveClass('active');
    expect(profileButton).toHaveAttribute('aria-current', 'page');
    expect(homeButton).not.toHaveClass('active');
  });

  it('should default to home when path does not match any valid id', () => {
    render(
      <MemoryRouter initialEntries={['/unknown']}>
        <BottomNav />
      </MemoryRouter>,
    );

    const homeButton = screen.getByRole('button', { name: /Home/i });
    expect(homeButton).toHaveClass('active');
    expect(homeButton).toHaveAttribute('aria-current', 'page');
  });

  it('should handle nested path correctly and extract last part as active id', () => {
    render(
      <MemoryRouter initialEntries={['/discover/explore']}>
        <BottomNav />
      </MemoryRouter>,
    );

    const exploreButton = screen.getByRole('button', { name: /Explore/i });
    expect(exploreButton).toHaveClass('active');
    expect(exploreButton).toHaveAttribute('aria-current', 'page');
  });

  it('should call navigate with correct path when navigation item clicked', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={['/home']}>
        <BottomNav />
      </MemoryRouter>,
    );

    const exploreButton = screen.getByRole('button', { name: /Explore/i });
    await user.click(exploreButton);

    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('/explore');
  });

  it('should call navigate with correct path for each navigation item', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={['/home']}>
        <BottomNav />
      </MemoryRouter>,
    );

    // Test all navigation items
    const testCases = [
      { name: /Home/i, expectedPath: '/home' },
      { name: /Explore/i, expectedPath: '/explore' },
      { name: /Saved/i, expectedPath: '/saved' },
      { name: /Profile/i, expectedPath: '/profile' },
    ];

    for (const { name, expectedPath } of testCases) {
      const button = screen.getByRole('button', { name });
      await user.click(button);
      expect(mockNavigate).toHaveBeenCalledWith(expectedPath);
    }

    expect(mockNavigate).toHaveBeenCalledTimes(4);
  });
});
