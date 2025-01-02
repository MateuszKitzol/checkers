import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
    /* Global Reset and Base Styles */
    *, *::before, *::after {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    /* Body Styles */
    body {
        font-family: 'Arial', sans-serif;
        background-color: #121212; /* Dark background */
        color: #e4e4e4; /* Light text for contrast */
        line-height: 1.6;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }

    /* Default Heading Styles */
    h1, h2, h3, h4, h5, h6 {
        font-weight: 600;
        color: #ffffff; /* White headings for dark background */
        margin-bottom: 0.5rem;
    }

    /* Default Paragraph Styles */
    p {
        margin-bottom: 1rem;
        color: #cccccc;
    }

    /* Button Styles */
    button, .button {
        font-size: 16px;
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 4px;
        background-color: #1f78d1; /* Vibrant blue for buttons */
        color: white;
        cursor: pointer;
        transition: background-color 0.3s ease;

        &:hover {
            background-color: #155a99; /* Darker blue on hover */
        }

        &:active {
            background-color: #103e6e; /* Even darker blue on click */
        }
    }

    /* Link Styles */
    a {
        color: #1f78d1; /* Same as button color */
        text-decoration: none;
        transition: color 0.3s ease;

        &:hover {
            color: #155a99; /* Same as button hover color */
        }
    }

    /* Container Utility Class */
    .container {
        width: 90%;
        max-width: 1200px;
        margin: 0 auto;
        padding: 1rem;
    }
`;

export default GlobalStyle;
