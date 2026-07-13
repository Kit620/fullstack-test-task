"use client";

import { useState } from "react";
import { Alert, Button, Card, Col, Container, Row } from "react-bootstrap";
import { AlertsTable } from "@/components/AlertsTable";
import { FilesTable } from "@/components/FilesTable";
import { UploadFileModal } from "@/components/UploadFileModal";
import { useAlerts } from "@/hooks/useAlerts";
import { useFiles } from "@/hooks/useFiles";
import { useUploadFile } from "@/hooks/useUploadFile";

export default function Page() {
  const filesHook = useFiles();
  const alertsHook = useAlerts();
  const uploadHook = useUploadFile(async () => {
    await filesHook.reload();
  });
  const [showModal, setShowModal] = useState(false);

  const errorMessage = uploadHook.errorMessage ?? filesHook.errorMessage ?? alertsHook.errorMessage;

  function reloadAll() {
    void filesHook.reload();
    void alertsHook.reload();
  }

  return (
    <Container fluid className="py-4 px-4 bg-light min-vh-100">
      <Row className="justify-content-center">
        <Col xxl={10} xl={11}>
          <Card className="shadow-sm border-0 mb-4">
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-start gap-3 flex-wrap">
                <div>
                  <h1 className="h3 mb-2">Управление файлами</h1>
                  <p className="text-secondary mb-0">
                    Загрузка файлов, просмотр статусов обработки и ленты алертов.
                  </p>
                </div>
                <div className="d-flex gap-2">
                  <Button variant="outline-secondary" onClick={reloadAll}>
                    Обновить
                  </Button>
                  <Button variant="primary" onClick={() => setShowModal(true)}>
                    Добавить файл
                  </Button>
                </div>
              </div>
            </Card.Body>
          </Card>

          {errorMessage ? (
            <Alert variant="danger" className="shadow-sm">
              {errorMessage}
            </Alert>
          ) : null}

          <FilesTable
            files={filesHook.files}
            isLoading={filesHook.isLoading}
            deletingId={filesHook.deletingId}
            onDelete={filesHook.remove}
          />
          <AlertsTable alerts={alertsHook.alerts} isLoading={alertsHook.isLoading} />
        </Col>
      </Row>

      <UploadFileModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onSubmit={uploadHook.submit}
        isSubmitting={uploadHook.isSubmitting}
      />
    </Container>
  );
}
