import { Button, Form, Modal } from "react-bootstrap";

import { Formik } from "formik";
import * as yup from "yup";
import axios from "axios";
const EditWordModal = ({
  showEditWord,
  setShowEditWord,
  currentWordID,
  currentWord,
  currentDesc,
  refetch,
}) => {
  /*------------------------Form Handling--------------------------- */

  const schema = yup.object().shape({
    word: yup.string(),
    description: yup.string(),
  });
  const handleClose = () => {
    setShowEditWord(false);
    document.getElementById("editWordForm").reset();
  };

  const submitEditWord = (values) => {
    const wordForm = new FormData();
    if (values.word.length > 0) {
      wordForm.append("word", values.word);
    }
    if (values.description.length > 0) {
      wordForm.append("description", values.description);
    }
    axios
      .patch(`http://localhost:3333/words/${currentWordID}`, wordForm, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        refetch();
        console.log(res);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  };
  return (
    <>
      {/*-------------------------------- Edit Word Modal------------------------------------ */}
      <Modal show={showEditWord} onHide={() => handleClose()}>
        <Formik
          initialValues={{
            word: "",
            description: "",
          }}
          validationSchema={schema}
          onSubmit={(values) => {
            submitEditWord(values);
          }}
        >
          {({
            handleSubmit,
            handleChange,
            handleBlur,
            setFieldValue,
            values,
            touched,
            isValid,
            errors,
          }) => (
            <Form onSubmit={handleSubmit} id="editWordForm">
              <Modal.Header closeButton>
                <Modal.Title>Edit Word</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form.Group className="mb-3" controlId="addWord">
                  <Form.Label>Word</Form.Label>
                  <Form.Control
                    name="word"
                    type="text"
                    placeholder={currentWord}
                    autoFocus
                    onChange={handleChange}
                    isInvalid={!!errors.word}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="addDesc">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    name="description"
                    as="textarea"
                    rows={3}
                    placeholder={currentDesc}
                    onChange={handleChange}
                    isInvalid={!!errors.description}
                  />
                </Form.Group>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => handleClose()}>
                  Close
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    isValid ? handleClose() : null;
                  }}
                  type="submit"
                >
                  Edit
                </Button>
              </Modal.Footer>
            </Form>
          )}
        </Formik>
      </Modal>
      {/*-------------------------------- Edit Word Modal------------------------------------ */}
    </>
  );
};

export default EditWordModal;
