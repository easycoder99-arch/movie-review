import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const NavigationBar = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="navbar-custom">
      <Container>
        <LinkContainer to="/">
          <Navbar.Brand className="fw-bold">
            🎬 MovieReviewHub
          </Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <LinkContainer to="/">
              <Nav.Link>Home</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/browse">
              <Nav.Link>Browse Movies</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/community">
              <Nav.Link>Community</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/my-reviews">
              <Nav.Link>My Reviews</Nav.Link>
            </LinkContainer>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;