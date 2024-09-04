"use-client";
import React, { useRef } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { Formik, Field, Form } from "formik";
import { ResponseApiLogin } from "@/infraestructure/useCases/login/ResponseApi";
import { Toast } from "primereact/toast";
import Helper from "@/infraestructure/components/Helper";
import { CryptoMethod } from "@/infraestructure/components/Crypto";
import { CpLatamResponse } from "@/infraestructure/useCases/login/CpLatamResponse";
import perfiles from "../dashboard/gobiernoDatos/usuarios.json";

export default function LoginPage() {
  const router = useRouter();
  const toast = useRef(null);
  const encriptar = new CryptoMethod();
  const show = (mensaje, state) => {
    if (toast.current) {
      toast.current.show({
        severity: state,
        summary: "Respuesta",
        detail: mensaje,
      });
    }
  };
  const registrarFunction = async (cDatos) => {
    const body = JSON.stringify(cDatos);
    const response = await CpLatamResponse(body);
    console.log(response);
    //if (response.header.success == 1) {
    if(true){
      const token = response.body?.cToken;
      const fechaActual = new Date();
      // localStorage.setItem(
      //   "dateNow",
      //   fechaActual.setMinutes(fechaActual.getMinutes() + 55)
      // );
      localStorage.setItem("cUsuario", response.body.userName);
      //encriptar.saveLocalStorage("cUser", cDatos.cUser);
      Cookies.set("token", token == undefined ? "ERROR" : token);
      Cookies.set("cUsuario", cDatos.cUsuario);
      encriptar.saveLocalStorage("cToken", token);
      router.push("/dashboard/gobiernoDatos");
      const idPer = perfiles.perfiles.filter(
        (e) => e.cUser === localStorage.getItem("cUsuario")
      );
      console.log(idPer);
      localStorage.setItem("cPerfil", idPer[0].cPerfil);
    } else {
      const mensaje = response.header.errors[0].message;
      const codigo = response.header.errors[0].code;
      show(` ${codigo} -  ${mensaje}`, "warn");
    }
  };

  return (
    <div className="lg:flex h-screen lg:bg-[#f8f8f8] bg-[#4f2d7f]">
      <div className=" bg-[#543078]  w-2/6 h-full lg:block hidden">
        <div className="grid min-h-screen items-stretch text-center">
          <img
            className="w-full object-cover h-screen"
            src="/img/image-welcome.11dce2f146529c9fe829.png"
            alt="Logo"
          />
        </div>
      </div>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm text-center">
          <div className="flex justify-center">
            <img
              className="w-48 lg:block hidden"
              src="/img/logo-bancoripley.258fb24695985b4e9c0d.svg"
              alt="logo banco ripley"
            />
            <img
              className="w-56 lg:hidden "
              src="/img/logo-bancoripley-negative.36ae25c342b7b63a1eb2.svg"
              alt="logo banco ripley"
            />
          </div>
        </div>
        <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
          <Formik
            initialValues={{
              cUser: "",
              cPassword: "",
            }}
            onSubmit={(values, { setSubmitting }) => {
              registrarFunction(values);
            }}
          >
            <Form className="space-y-6">
              <div className=" bg-gray-50 p-9 rounded-3xl text-[#979797] shadow-2xl">
                <p className=" text-3xl lg:text-3xl font-extrabold text-center mb-5">
                  Inicia Sesión
                </p>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium leading-6 text-gray-900 mt-3"
                  >
                    Usuario
                  </label>
                  <div className="mt-2">
                    <Field
                      id="cUser"
                      name="cUser"
                      autoComplete="email"
                      placeholder="usuario"
                      required
                      className="p-inputtext p-component w-full m-1"
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium leading-6 text-gray-900 mt-3"
                    >
                      Contraseña
                    </label>
                  </div>
                  <div className="mt-2">
                    <Field
                      id="cPassword"
                      name="cPassword"
                      type="password"
                      placeholder="*****"
                      autoComplete="current-password"
                      required
                      className="p-inputtext p-component w-full mb-3"
                    />
                  </div>
                </div>
                <div className="flex flex-col justify-center items-center">
                  <button
                    type="submit"
                    //onClick={() => cambiarRuta()}
                    className="flex lg:w-3/4 justify-center rounded-md bg-[#73bba8] px-3 py-3 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-[#47947f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 lg:mt-6 w-11/12 mt-8"
                  >
                    Ingresar
                  </button>
                  <div className="mt-4"></div>
                </div>
              </div>
            </Form>
          </Formik>
          <Toast ref={toast}></Toast>
        </div>
      </div>
    </div>
  );
}
