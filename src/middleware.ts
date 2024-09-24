import { NextRequest, NextResponse } from "next/server";
import Helper from "./infraestructure/components/Helper";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const tokenCookies = request.cookies.get("cToken");
  var nCantidadPalabra = request.url.length;
  var cCondicionPalabra = request.url.substring(
    nCantidadPalabra - 9,
    nCantidadPalabra
  );

  // if (cCondicionPalabra === "dashboard") {
  //   return NextResponse.redirect(new URL("/", request.url));
  // }
  if (tokenCookies == undefined) {
    return NextResponse.redirect(new URL("/", request.url));
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/dashboard/PaymentTickets", "/dashboard"],
};
