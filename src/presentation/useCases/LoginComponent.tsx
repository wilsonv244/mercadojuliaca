import { useRouter } from "next/navigation";
export class LoginComponent {
  SalirPage(codigoResponse: number) {
    const router = useRouter();
    switch (codigoResponse) {
      case 401:
        router.push("/");
        break;

      default:
        break;
    }
  }
}

export default function GetOut(codigoResponse: number) {
  const router = useRouter();
  switch (codigoResponse) {
    case 401:
      router.push("/");
      break;

    default:
      break;
  }
}
