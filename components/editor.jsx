"use client";
import React from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import ImageUploader from "quill-image-uploader";
import { axiosInstance } from "@/lib/axios";

Quill.register("modules/imageUploader", ImageUploader);

const Size = Quill.import("formats/size");
Size.whitelist = ["extra-small", "small", "medium", "large"];
Quill.register(Size, true);

function imageHandler() {
  const range = this.quill.getSelection();
  const value = prompt("Please paste the image URL here:");
  if (value) {
    this.quill.insertEmbed(range.index, "image", value, Quill.sources.USER);
  }
}
const CustomUndo = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
  >
    <path
      fill="currentColor"
      d="M13 19c0 .7.13 1.37.35 2H5a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h14a2 2 0 0 1 2 2v8.35c-.63-.22-1.3-.35-2-.35V5H5v14zm.96-6.71l-2.75 3.54l-1.96-2.36L6.5 17h6.85c.4-1.12 1.12-2.09 2.05-2.79zM20 18v-3h-2v3h-3v2h3v3h2v-3h3v-2z"
    />
  </svg>
);

export default function Editor({
  value,
  academyId,
  moduleGroupId,
  moduleId,
  setContent,
}) {
  const onChangeHandler = (value) => {
    setContent(value);
  };

  const modules = {
    toolbar: {
      container: "#toolbar",
      handlers: {
        image_with_url: imageHandler,
      },
    },
    history: {
      delay: 500,
      maxStack: 100,
      userOnly: true,
    },
    imageUploader: {
      upload: (file) => {
        return new Promise(async (resolve, reject) => {
          console.log(file);
          const formData = new FormData();
          formData.append("modulePicture", file);

          try {
            const result = await axiosInstance.post(
              `/academies/${academyId}/module-groups/${moduleGroupId}/modules/${moduleId}/images`,
              formData,
              {
                timeout: 10000,
              }
            );
            resolve(result.data.data.image_url);
          } catch (error) {
            console.error(error);
            reject("Upload failed");
          }
        });
      },
    },
  };

  // Formats objects for setting up the Quill editor
  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "align",
    "strike",
    "script",
    "blockquote",
    "background",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "color",
    "code-block",
  ];

  return (
    <>
      <div id="toolbar">
        <select className="ql-header" defaultValue="3">
          <option value="1">Heading</option>
          <option value="2">Subheading</option>
          <option value="3">Normal</option>
        </select>
        <span className="ql-formats">
          <select className="ql-size" defaultValue="medium">
            <option value="extra-small">Size 1</option>
            <option value="small">Size 2</option>
            <option value="medium">Size 3</option>
            <option value="large">Size 4</option>
          </select>
        </span>
        <span className="ql-formats">
          <button className="ql-bold" />
          <button className="ql-italic" />
          <button className="ql-underline" />
          <button className="ql-strike" />
        </span>
        <span className="ql-formats">
          <button className="ql-list" value="ordered" />
          <button className="ql-list" value="bullet" />
          <button className="ql-indent" value="-1" />
          <button className="ql-indent" value="+1" />
        </span>
        <span className="ql-formats">
          <button className="ql-script" value="super" />
          <button className="ql-script" value="sub" />
          <button className="ql-blockquote" />
          <button className="ql-direction" />
        </span>
        <span className="ql-formats">
          <select className="ql-align" />
          <select className="ql-color" />
          <select className="ql-background" />
        </span>
        <span className="ql-formats relative">
          <button className="ql-link" />
          <button className="ql-image" />
        </span>

        <span className="ql-formats">
          <button className="ql-image_with_url">
            <CustomUndo />
          </button>
        </span>
        <span className="ql-formats">
          <button className="ql-formula" />
          <button className="ql-code-block" />
          <button className="ql-clean" />
        </span>
      </div>
      <ReactQuill
        theme="snow"
        value={value ? value : ""}
        modules={modules}
        formats={formats}
        onChange={onChangeHandler}
      />
    </>
  );
}
