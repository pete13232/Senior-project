import { Button, Form, Modal } from "react-bootstrap";

import { Formik } from "formik";
import * as yup from "yup";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const EditWordModal = ({
  showEditWord,
  setShowEditWord,
  currentWordID,
  currentWord,
  currentDesc,
  refetch,
}) => {
  const MySwal = withReactContent(Swal);
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
    if (values.word.length > 0 || values.description.length > 0) {
      axios
        .patch(`http://localhost:3333/words/${currentWordID}`, wordForm, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          MySwal.fire({
            position: "center",
            title: "แก้ไขสำเร็จ!",
            text: `คำว่า\n"${currentWord}"\nถูกแก้ไขเรียบร้อย`,
            icon: "success",
          });
          refetch(); // refetch changed data
          console.log(res);
        })
        .catch((error) => {
          MySwal.fire({
            position: "center",
            title: "เกิดข้อผิดพลาด",
            html: error,
            icon: "error",
            allowOutsideClick: false,
            allowEscapeKey: false,
          });
          console.error("There was an error!", error);
        });
    }
  };
  return (
    <>
      {/*-------------------------------- Edit Word Modal------------------------------------ */}
      <Modal centered show={showEditWord} onHide={() => handleClose()}>
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
