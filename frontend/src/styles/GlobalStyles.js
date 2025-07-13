import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  @font-face {
    font-family: 'Pretendard';
    src: url('https://fastly.jsdelivr.net/gh/Project-Noonnu/noonfonts_2107@1.1/Pretendard-Regular.woff') format('woff');
    font-weight: 400;
    font-style: normal;
  }

  :root {
    --primary-color: #FF6B35;
    --primary-light: #FF8B5E;
    --primary-dark: #E64F20;
    --secondary-color: #624CAB;
    --secondary-light: #7E6BC6;
    --secondary-dark: #493A87;
    --accent-color: #00C2FF;
    --background-color: #FAFAFA;
    --card-bg: #FFFFFF;
    --text-primary: #333333;
    --text-secondary: #666666;
    --text-light: #FFFFFF;
    --error: #FF3B3B;
    --success: #00C853;
    --warning: #FFC107;
    --border-radius-sm: 8px;
    --border-radius-md: 12px;
    --border-radius-lg: 20px;
    --box-shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.08);
    --box-shadow-md: 0 4px 16px rgba(0, 0, 0, 0.12);
    --box-shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.15);
    --transition-fast: 0.2s ease;
    --transition-normal: 0.3s ease;
    --transition-slow: 0.5s ease;
    --font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html, body {
    font-family: var(--font-family);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: var(--background-color);
    color: var(--text-primary);
    font-size: 16px;
    overflow-x: hidden;
    width: 100%;
    height: 100%;
  }

  #root {
    display: flex;
    flex-direction: column;
    min-height: 100%;
    width: 100%;
  }

  @media (min-width: 768px) {
    #root {
      max-width: 480px;
      margin: 0 auto;
      height: 100vh;
      overflow: hidden;
      box-shadow: var(--box-shadow-lg);
      border-radius: var(--border-radius-lg);
    }
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight: 700;
    line-height: 1.2;
    margin-bottom: 0.5em;
  }

  a {
    text-decoration: none;
    color: var(--primary-color);
    transition: var(--transition-normal);
  }

  button {
    cursor: pointer;
    font-family: var(--font-family);
    border: none;
    background: none;
    transition: var(--transition-normal);
    
    &:disabled {
      cursor: not-allowed;
      opacity: 0.7;
    }
  }

  img {
    max-width: 100%;
    height: auto;
  }

  input, textarea, select {
    font-family: var(--font-family);
    font-size: 16px;
    border: 1px solid #ddd;
    border-radius: var(--border-radius-sm);
    padding: 10px 12px;
    transition: var(--transition-fast);
    
    &:focus {
      outline: none;
      border-color: var(--primary-color);
      box-shadow: 0 0 0 2px rgba(255, 107, 53, 0.2);
    }
  }
`;

export default GlobalStyles; 