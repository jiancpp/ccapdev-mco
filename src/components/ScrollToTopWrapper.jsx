import { useLayoutEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";

function ScrollToTopWrapper() {
    const { pathname } = useLocation();

    useLayoutEffect(() => {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
      }, [pathname]);
    

    return <Outlet />;
}

export default ScrollToTopWrapper;