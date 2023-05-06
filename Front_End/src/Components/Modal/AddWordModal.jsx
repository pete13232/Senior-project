import { Button, Form, Modal } from "react-bootstrap";

import { Formik } from "formik";
import * as yup from "yup";
import axios from "axios";
import FBXtoJSON from "../Utils/FBXToJSON";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const AddWordModal = ({ showAddWord, setShowAddWord, refetch }) => {
  /*------------------------Form Handling--------------------------- */

  const MySwal = withReactContent(Swal);

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
    console.log(
      "localStorage before add word = " + localStorage.getItem("token")
    );
    axios
      .post("http://localhost:3333/words/add", wordForm, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((addWordResponse) => {
        if (values.animation instanceof File) {
          FBXtoJSON({ file: values.animation }).then((result) => {
            if (result !== undefined) {
              const blob = new Blob([JSON.stringify(result)], {
                type: "application/json",
              });
              const animationForm = new FormData();
              animationForm.append(
                "file",
                blob,
                addWordResponse.data._id + "animation_clip"
              );
              MySwal.fire({
                title: "รอสักครู่",
                text: `กำลังอัปโหลดแอนิเมชัน`,
                allowOutsideClick: false,
                didOpen: () => {
                  MySwal.showLoading();
                  axios
                    .post(
                      `http://localhost:3333/animations/add?wordID=${addWordResponse.data._id}`,
                      animationForm,
                      {
                        headers: {
                          Authorization: `Bearer ${localStorage.getItem(
                            "token"
                          )}`,
                        },
                      }
                    )
                    .then((res) => {
                      MySwal.fire({
                        position: "center",
                        title: "เพิ่มคำสำเร็จ!",
                        text: `คำว่า\n"${addWordResponse.data.word}"\nถูกเพิ่มเรียบร้อย`,
                        icon: "success",
                      });
                      refetch(); // refetch changed data
                      console.log(res);
                    })
                    .catch((error) => {
                      MySwal.fire({
                        position: "center",
                        title: "เกิดข้อผิดพลาดในการอัปโหลดแอนิเมชัน",
                        html: err,
                        icon: "error",
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                      });
                      refetch(); // refetch changed data
                      console.error("There was an error!", error);
                    });
                },
              });
            } else {
              MySwal.fire({
                position: "center",
                title: "เพิ่มคำสำเร็จ!",
                text: `คำว่า\n"${addWordResponse.data.word}"\nถูกเพิ่มเรียบร้อย`,
                icon: "success",
              });
              refetch(); // refetch changed data
            }
          });
        } else {
          MySwal.fire({
            position: "center",
            title: "เพิ่มคำสำเร็จ!",
            text: `คำว่า\n"${addWordResponse.data.word}"\nถูกเพิ่มเรียบร้อย`,
            icon: "success",
          });
          refetch(); // refetch changed data
        }
      })
      .catch((error) => {
        MySwal.fire({
          position: "center",
          title: "เกิดข้อผิดพลาดในการเพิ่มคำ",
          html: err,
          icon: "error",
          allowOutsideClick: false,
          allowEscapeKey: false,
        });
        console.error("There was an error!", error);
      });
  };
  return (
    <>
      {/*-------------------------------- Add Word Modal------------------------------------ */}
      <Modal centered show={showAddWord} onHide={() => handleClose()}>
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
