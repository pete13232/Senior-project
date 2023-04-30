import { Button, Form, Modal } from "react-bootstrap";

import { Formik } from "formik";
import * as yup from "yup";
import axios from "../Utils/axiosInstance";
import FBXtoJSON from "../Utils/FBXToJSON";
const AddWordModal = ({ showAddWord, setShowAddWord }) => {
  /*------------------------Form Handling--------------------------- */

  const schema = yup.object().shape({
    word: yup.string().required(),
    description: yup.string().required(),
    animation: yup.mixed(),
  });
  const handleClose = () => {
    setShowAddWord(false);
    document.getElementById("addWordForm").reset();
  };

  const submitAddWord = (values) => {
    const wordForm = new FormData();
    wordForm.append("word", values.word);
    wordForm.append("description", values.description);
    axios
      .post("http://localhost:3333/words/add", wordForm)
      .then((res) => {
        console.log(res);
        if (values.animation.length > 0) {
          console.log("values.animation", values.animation);

          // FBXtoJSON({ file: values.animation }).then((result) => {
          //   const blob = new Blob([JSON.stringify(result)], {
          //     type: "application/json",
          //   });
          //   const formData = new FormData();
          //   formData.append("word", valu
          //.word);
          //   formData.append("file", blob, values.word + "animation_clip");
          //   const reader = new FileReader();
          //   reader.readAsText(blob);
          //   reader.onload = () => {
          //     const data = JSON.parse(reader.result);
          //     console.log(data); // logs the parsed JSON data
          //   };
          //   axios
          //     .post("http://localhost:3333/animations/add", formData)
          //     .then((res) => {
          //       console.log(res);
          //     })
          //     .catch((error) => {
          //       console.error("There was an error!", error);
          //     });
          // });
        }
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  };
  return (
    <>
      {/*-------------------------------- Add Word Modal------------------------------------ */}
      <Modal show={showAddWord} onHide={() => handleClose()}>
        <Formik
          initialValues={{
            word: "",
            description: "",
            animation: "",
          }}
          validationSchema={schema}
          onSubmit={(values) => {
            submitAddWord(values);
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
            <Form onSubmit={handleSubmit} id="addWordForm">
              <Modal.Header closeButton>
                <Modal.Title>Add Word</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form.Group className="mb-3" controlId="addWord">
                  <Form.Label>Word</Form.Label>
                  <Form.Control
                    name="word"
                    type="text"
                    placeholder="Enter word"
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
                    placeholder="Enter description"
                    onChange={handleChange}
                    isInvalid={!!errors.description}
                  />
                </Form.Group>
                <Form.Group controlId="addAnimation" className="mb-3">
                  <Form.Label>FBX Animation File</Form.Label>
                  <Form.Control
                    name="animation"
                    type="file"
                    isInvalid={!!errors.file}
                    onChange={(event) => {
                      setFieldValue("animation", event.currentTarget.files[0]);
                    }}
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
                  Add
                </Button>
              </Modal.Footer>
            </Form>
          )}
        </Formik>
      </Modal>
      {/*-------------------------------- Add Word Modal------------------------------------ */}
    </>
  );
};

export default AddWordModal;
