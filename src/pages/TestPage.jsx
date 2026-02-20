import React, { useState } from 'react';
import { Button, Modal, Container } from 'react-bootstrap';

const TestPage = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <Container className="py-5">
      <h1 className="mb-4">Página de Teste</h1>
      <Button variant="primary" onClick={() => setShowModal(true)}>
        Abrir Modal de Teste
      </Button>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Teste de Modal</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Se você está vendo este modal, o React Bootstrap está funcionando corretamente!</p>
          <p className="text-success">✅ Sistema operacional!</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Fechar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default TestPage;