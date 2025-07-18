import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import "./App.css";
import LazyImage from "./components/LazyImage";
import { changeHostname, decodeHTML, formatDate } from "./utils/util";

function App() {
  const [data, setData] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [isVisible, setIsVisible] = useState(true);

  const lastScrollYRef = useRef(0);

  const page = parseInt(searchParams.get("page") || "1");
  const pageSize = parseInt(searchParams.get("size") || "10");
  const sort = searchParams.get("sort") || "-published_at";

  const updateQuery = (params) => {
    if (params.page <= 1) return;
    if (params.size <= 10) return;

    setSearchParams({
      page,
      size: pageSize,
      sort,
      ...params,
    });
  };

  const handleSetPageSize = (event) => {
    updateQuery({ size: event.target.value, page: 1 });
  };

  const handleSetSort = (event) => {
    updateQuery({ sort: event.target.value, page: 1 });
  };

  const getData = useCallback(async () => {
    try {
      const url = `https://suitmedia-backend.suitdev.com/api/ideas?page[number]=${page}&page[size]=${pageSize}&append[]=small_image&append[]=medium_image&sort=${sort}`;

      const res = await axios.get(url, {
        headers: {
          Accept: "application/json",
        },
      });
      setData(res.data);
    } catch (err) {
      console.error("Error fetching data:", err.response || err.message || err);
    }
  }, [page, pageSize, sort]);

  useEffect(() => {
    getData();

    const handleScroll = () => {
      const currentY = window.scrollY;
      setIsVisible(currentY < lastScrollYRef.current);
      lastScrollYRef.current = currentY;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [getData, page, pageSize, sort]);

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

            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {data &&
                data.data.map((post) => (
                  <div
                    key={post.id}
                    className="max-w-sm bg-white rounded-lg shadow-md"
                  >
                    <a href="#">
                      <LazyImage
                        src={
                          post?.medium_image[0]?.url &&
                          changeHostname(post.medium_image[0].url)
                        }
                        alt={post.slug}
                        className="rounded-t-lg w-full h-[180px] bg-cover"
                      ></LazyImage>
                    </a>

                    <div className="p-5">
                      <span className="text-sm text-gray-500">
                        {formatDate(post.updated_at)}
                      </span>
                      <a href="#">
                        <h5 className="text-xl font-medium tracking-tight text-gray-900 line-clamp-3">
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
                onClick={() => updateQuery({ page: 1 })}
              >
                First
              </a>
            </div>
            <div className="order-1 col-span-4 flex justify-center gap-1 sm:order-2">
              {data &&
                data.meta.links.map((link, index) => {
                  let d = data.meta.links;

                  if (index == 0)
                    return (
                      <a
                        key={index}
                        className={`rounded-lg flex items-center gap-2 border border-transparent px-3 py-1 transition duration-150 ease-in-out hover:bg-orange-200 ${link.active ? "bg-orange-500 text-white" : ""}`}
                        onClick={() => {
                          // const url = new URL(link.url);
                          // const newPage = url.searchParams.get("page[number]");
                          updateQuery({ page: page - 1 });
                        }}
                      >
                        <>&laquo;</>
                      </a>
                    );

                  if (index == d.length - 1)
                    return (
                      <a
                        key={index}
                        className={`rounded-lg flex items-center gap-2 border border-transparent px-3 py-1 transition duration-150 ease-in-out hover:bg-orange-200 ${link.active ? "bg-orange-500 text-white" : ""}`}
                        onClick={() => {
                          if (page <= d.length - 3) {
                            updateQuery({ page: page + 1 });
                          }
                        }}
                      >
                        <>&raquo;</>
                      </a>
                    );

                  return (
                    <a
                      key={index}
                      className={`rounded-lg flex items-center gap-2 border border-transparent px-3 py-1 transition duration-150 ease-in-out hover:bg-orange-200 ${link.active ? "bg-orange-500 text-white" : ""}`}
                      onClick={() => {
                        const url = new URL(link.url);
                        const newPage = url.searchParams.get("page[number]");
                        updateQuery({ page: newPage });
                      }}
                    >
                      <>{link && decodeHTML(link.label)}</>
                    </a>
                  );
                })}
            </div>
            <div className="wt-button-font order-2 col-span-2 flex items-center gap-2">
              <a
                className={`rounded-lg flex items-center gap-2 border border-transparent px-3 py-1 transition duration-150 ease-in-out hover:bg-orange-200`}
                onClick={() => updateQuery({ page: data.meta.last_page })}
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
