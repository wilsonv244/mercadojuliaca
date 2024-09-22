"use client";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Dialog, Disclosure, Popover, Transition } from "@headlessui/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import Cookies from "js-cookie";
import { usePathname } from "next/navigation";
import { Tag } from "primereact/tag";

type LogoutFunction = (route: string) => void;

const getOut: LogoutFunction = (label) => {
  if (label === "Cerrar session") {
    localStorage.clear();
    Cookies.remove("cToken");
    Cookies.remove("cUsuario");
  }
};

const LinkPage = [
  {
    icon: "pi pi-spin pi-cog",
    label: "Sistematización",
    route: "/dashboard/Sistematizacion",
  },
  {
    icon: "pi pi-bookmark-fill",
    label: "Ingresos",
    route: "/dashboard/sales",
  },
  {
    icon: "pi pi-bookmark-fill",
    label: "Costos",
    route: "/dashboard/costos",
  },
  {
    icon: "pi pi-database",
    label: "BD",
    route: "/dashboard/dataBases",
  },
  {
    icon: "pi pi-credit-card",
    label: "Movimiento Bancario",
    route: "/dashboard/movimientoBancario",
  },
  { icon: "pi pi-power-off hover:font-bold", label: "", route: "#" },
];

export default function PanelPrincipal() {
  const pathRoute = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [UserProfile, setUserProfile] = useState({
    id_user: "",
    user_name: "",
    user_password: "",
    profile: "",
    status: true,
    created_at: "",
    updated_at: "",
  });
  const user: string | null = localStorage.getItem("user_login");
  useEffect(() => {
    const userProfile = JSON.parse(user ?? "");

    setUserProfile(userProfile);
  }, []);

  return (
    <header className="bg-[#fbb517] shadow-md mb-5">
      <nav
        className="flex flex-col w-full items-center justify-between p-6 lg:px-40"
        aria-label="Global"
      >
        <div className="flex w-full justify-between">
          <div className="flex lg:flex-1">
            <a href="#" className="-m-1">
              <img className="w-12" src="/img/logo-lays.png" alt="" />
            </a>
          </div>
          <Popover.Group className="hidden lg:flex lg:gap-x-12 lg:items-center text-black">
            <div className="card flex flex-wrap justify-content-center gap-2">
              <Tag
                className="mr-1"
                icon="pi pi-user"
                value={UserProfile.user_name || ""}
              ></Tag>
              <Tag
                className="mr-1"
                icon="pi pi-info-circle"
                severity="info"
                value={UserProfile.profile || ""}
              ></Tag>
            </div>
            {LinkPage.map(({ icon, label, route }) => {
              const isActive: boolean | undefined =
                pathRoute?.startsWith(route);

              const className = `${icon} ml-2`;
              return (
                <>
                  <Link
                    key={label}
                    href={route}
                    onClick={() => getOut(label)}
                    className={
                      isActive
                        ? "text-[#ee3124] font-extrabold text-sm"
                        : "text-sm font-semibold leading-6 text-black hover:text-[#ee3124]"
                    }
                  >
                    {label}
                    <i className={className} style={{ color: "#ffffff" }}></i>
                  </Link>
                </>
              );
            })}
          </Popover.Group>
          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Bars3Icon className="h-6 w-6 text-white" aria-hidden="true" />
            </button>
          </div>
        </div>
      </nav>
      <Dialog
        as="div"
        className="lg:hidden"
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
      >
        <div className="fixed inset-0 z-10" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <a href="#" className="-m-1.5 p-1.5">
              <img
                className="h-8 w-auto"
                src="/img/logo-bancoripley.258fb24695985b4e9c0d.svg"
                alt=""
              />
            </a>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                {LinkPage.map(({ label, route }) => (
                  <>
                    <Link
                      href={route}
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                    >
                      {label}
                    </Link>
                  </>
                ))}
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  );
}
