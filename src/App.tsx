import { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";

const App = () => {
  const [roundCount, setRoundCount] = useState<number>(5);

  return (
    <Container fluid className="vh-100 d-flex flex-column">
      {/* Header */}
      <Row className="bg-primary text-white text-center py-3">
        <Col>
          <h1>Bank it!</h1>
        </Col>
      </Row>

      {/* Main Content */}
      <Row className="flex-grow-1 align-items-center justify-content-center">
        <Col xs={12} md={6} className="text-center">
          </Col>
      </Row>
    </Container>
  )
}