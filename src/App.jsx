import { useEffect, useState, useCallback, useRef } from "react";
import "./App.css";
import axios from "axios";
import LazyImage from "./components/LazyImage";

// todo:
// - halaman di-refresh, data atau state pada halaman itu tidak kembali ke state awal

function App() {
  const [isVisible, setIsVisible] = useState(true);
  // const [lastScrollY, setLastScrollY] = useState(1);

  const lastScrollYRef = useRef(0);

  const [data, setData] = useState(null);
  const [pageSize, setPageSize] = useState(10);
  const [sort, setSort] = useState("published_at");

  const changeHostname = (oldUrl) => {
    var url = new URL(oldUrl);
    url.hostname = "suitmedia.static-assets.id";
    return url.href;
  };

  const decodeHTML = (html) => {
    const parser = new DOMParser();
    const decoded = parser.parseFromString(html, "text/html");
    return decoded.documentElement.textContent;
  };

  const handleSetPageSize = (event) => {
    setPageSize(event.target.value);
  };

  const handleSetSort = (event) => {
    setSort(event.target.value);
  };

  const getData = useCallback(async (url) => {
    try {
      if (!url) return;

      const res = await axios.get(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/91.0.4472.124 Safari/537.36",
          Accept: "application/json",
        },
      });
      setData(res.data);
    } catch (err) {
      console.error("Error fetching data:", err.response || err.message || err);
    }
  }, []);

  useEffect(() => {
    console.log("i fire once");
    getData(
      `https://suitmedia-backend.suitdev.com/api/ideas?page[number]=1&page[size]=${pageSize}&append[]=small_image&append[]=medium_image&sort=${sort}`,
    );

    const handleScroll = () => {
      const currentY = window.scrollY;
      setIsVisible(currentY < lastScrollYRef.current);
      lastScrollYRef.current = currentY;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [getData, pageSize, sort]);

  // console.log(data);

  return (
    <div>
      <header
        className={`fixed top-0 left-0 w-full bg-orange-500 shadow-md transition-all duration-300 z-50 ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="container mx-auto px-14 py-4">
          <div className="flex justify-between items-center">
            {/* <!-- Logo --> */}
            <div>
              <a href="/">
                <img
                  width="95"
                  alt="Suitmedia Digital Agency"
                  className="filter brightness-0 invert"
                  src="https://suitmedia.com/_ipx/w_200&f_webp&q_100/assets/img/site-logo.png"
                />
              </a>
            </div>

            {/* <!-- Navigation --> */}
            <nav>
              <ul className="flex space-x-4 text-sm text-white">
                <li>
                  <a href="#work" className="block py-2 px-1 text-white">
                    Work
                  </a>
                </li>
                <li>
                  <a href="#about" className="block py-2 px-1 text-white">
                    About
                  </a>
                </li>
                <li>
                  <a href="#services" className="block py-2 px-1 text-white">
                    Services
                  </a>
                </li>
                <li>
                  <a
                    href="#ideas"
                    className="block py-2 px-1 text-white active"
                  >
                    Ideas
                  </a>
                </li>
                <li>
                  <a href="#careers" className="block py-2 px-1 text-white">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#contact" className="block py-2 px-1 text-white">
                    Contact
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>

      {/* <!-- Main Content --> */}
      <main className="mx-auto">
        <section className="py-32 bg-white bg-fixed bg-center bg-cover banner">
          <div className="w-full flex flex-col items-center text-white justify-center">
            <h1 className="text-5xl font-normal">Ideas</h1>
            <p className="text-lg">Where all our great things begin</p>
          </div>
        </section>

        <section className="container mx-auto bg-white px-14">
          <div>
            <div className="flex flex-col md:flex-row justify-between py-6 my-4">
              <div className="text-gray-600">
                Showing {data?.meta?.from} - {data?.meta?.to} of{" "}
                {data?.meta?.total}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center ">
                  <span className="text-gray-600 mr-2">Show per page:</span>
                  <div className="select-border bg-white border border-gray-300 rounded-full text-gray-700">
                    <select
                      className="rounded-full px-1 py-1"
                      onChange={handleSetPageSize}
                      value={pageSize}
                    >
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center">
                  <span className="text-gray-600 mr-2">Sort by:</span>
                  <div className="select-border bg-white border border-gray-300 rounded-full text-gray-700">
                    <select
                      className="rounded-full px-1 py-1"
                      onChange={handleSetSort}
                      value={sort}
                    >
                      <option value={"published_at"}>Newest</option>
                      <option value={"-published_at"}>Oldest</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/*  */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {data &&
                data.data.map((post) => (
                  <div
                    key={post.id}
                    className="max-w-sm bg-white rounded-lg shadow-md"
                  >
                    <a href="#">
                      <LazyImage
                        src={changeHostname(post.medium_image[0].url)}
                        alt={post.slug}
                        className="rounded-t-lg w-full h-[180px] bg-cover"
                      ></LazyImage>
                    </a>
                    <div className="p-5">
                      <a href="#">
                        <h5 className="mb-2 text-xl font-medium tracking-tight text-gray-900 line-clamp-3">
                          {post.title}
                        </h5>
                      </a>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </section>

        <section className="container mx-auto bg-white px-14 mb-10">
          <div className="col-span-12 mx-auto mt-12 grid grid-cols-4 grid-rows-2 items-center gap-1 px-4 py-4 pb-8 sm:flex sm:justify-center">
            <div className="wt-button-font order-2 col-span-2 flex justify-end gap-2">
              <a
                className={`rounded-lg flex items-center gap-2 border border-transparent px-3 py-1 transition duration-150 ease-in-out hover:bg-orange-200`}
                // href={data && data.links.first}
                onClick={() => data?.links?.first && getData(data.links.first)}
              >
                First
              </a>
            </div>
            <div className="order-1 col-span-4 flex justify-center gap-1 sm:order-2">
              {data &&
                data.meta.links.map((link, index) => (
                  <a
                    key={index}
                    className={`rounded-lg flex items-center gap-2 border border-transparent px-3 py-1 transition duration-150 ease-in-out hover:bg-orange-200 ${link.active ? "bg-orange-500 text-white" : ""}`}
                    // href={link.url}
                    onClick={() => link?.url && getData(link.url)}
                  >
                    <>{link && decodeHTML(link.label)}</>
                  </a>
                ))}
            </div>
            <div className="wt-button-font order-2 col-span-2 flex items-center gap-2">
              <a
                className={`rounded-lg flex items-center gap-2 border border-transparent px-3 py-1 transition duration-150 ease-in-out hover:bg-orange-200`}
                // href={data && data.links.last}
                onClick={() => data?.links?.last && getData(data.links.last)}
              >
                Last
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
