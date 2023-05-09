import { Button, Form, Modal } from "react-bootstrap";
import { Formik } from "formik";
import * as yup from "yup";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

import FBXtoJSON from "../Function/FBXToJSON";
const UploadAnimation = ({ currentWordID, currentWord, refetch }) => {
  const schema = yup.object().shape({
    animation: yup.mixed(),
  });

  const MySwal = withReactContent(Swal);
  const handleAddAnimation = (values) => {
    document.getElementById("addAnimationForm").reset();
    if (values.animation instanceof File) {
      MySwal.fire({
        title: "รอสักครู่",
        text: `กำลังอัปโหลดแอนิเมชัน`,
        allowOutsideClick: false,
        didOpen: () => {
          MySwal.showLoading();
          FBXtoJSON({ file: values.animation }).then((result) => {
            if (result !== undefined) {
              const blob = new Blob([result], {
                type: "application/json",
              });
              const animationForm = new FormData();
              animationForm.append(
                "file",
                blob,
                currentWordID + "animation_clip.json.gz"
                // currentWordID + "animation_clip.json"
              );
              axios
                .post(
                  `http://localhost:3333/animations/add?wordID=${currentWordID}`,
                  animationForm,
                  {
                    headers: {
                      Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                  }
                )
                .then((res) => {
                  MySwal.fire({
                    position: "center",
                    title: "เพิ่มแอนิเมชันสำเร็จ!",
                    text: `แอนิเมชันของ\n"${currentWord}"\nถูกเพิ่มเรียบร้อย`,
                    icon: "success",
                  });
                  refetch(); // refetch changed data
                  console.log(res);
                })
                .catch((error) => {
                  MySwal.fire({
                    position: "center",
                    title: "เกิดข้อผิดพลาดในการอัปโหลดแอนิเมชัน",
                    html: error,
                    icon: "error",
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                  });
                  refetch(); // refetch changed data
                  console.error("There was an error!", error);
                });
            } else {
              MySwal.fire({
                position: "center",
                title: "เกิดข้อผิดพลาดเกี่ยวกับประเภทของไฟล์",
                icon: "error",
                allowOutsideClick: false,
                allowEscapeKey: false,
              });
            }
          });
        },
      });
    } else {
      MySwal.fire({
        position: "center",
        title: "เกิดข้อผิดพลาดเกี่ยวกับประเภทของไฟล์",
        icon: "error",
        allowOutsideClick: false,
        allowEscapeKey: false,
      });
    }
  };
  return (
    <>
      <Formik
        initialValues={{
          animation: "",
        }}
        validationSchema={schema}
        onSubmit={(values) => {
          handleAddAnimation(values);
        }}
      >
        {({ handleSubmit, setFieldValue, isValid, errors }) => (
          <Form onSubmit={handleSubmit} id="addAnimationForm">
            <Form.Group controlId="addAnimation" className="mb-3">
              <Form.Label>FBX Animation File</Form.Label>
              <div className="d-flex">
                <Form.Control
                  name="animation"
                  type="file"
                  isInvalid={!!errors.file}
                  onChange={(event) => {
                    setFieldValue("animation", event.currentTarget.files[0]);
                  }}
                />
                <Button className="mx-2 " variant="primary" type="submit">
                  อัพโหลด
                </Button>
              </div>
            </Form.Group>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default UploadAnimation;
