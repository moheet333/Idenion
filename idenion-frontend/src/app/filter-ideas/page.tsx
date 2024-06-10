"use client";
import SingleBlog from "@/components/Blog/SingleBlog";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import "../axios.js";
import { useCookies } from "react-cookie";

const Blog = () => {
  const router = useRouter();

  const [ideas, setIdeas] = useState([]);
  const [page, setPage] = useState(1);
  const [numberOfIdeas, setNumberOfIdeas] = useState(0);
  const [cookies, setCookie, removeCookie] = useCookies(["isLoggedIn"]);

  const [filter, setFilter] = useState({
    name: "",
    author: "",
    areaOfInterest: [],
    rating: 0,
    numberOfRating: 0,
    sort: false,
  });

  useEffect(() => {
    if (!cookies || !cookies.isLoggedIn) {
      router.push("/signin");
    }
  }, []);

  useEffect(() => {
    const fetch = async () => {
      try {
        let url = `idea/filterIdeas?page=${page}`;
        if (filter.name) {
          url += `&name=${filter.name}`;
        }
        if (filter.author) {
          url += `&author=${filter.author}`;
        }
        if (
          filter.areaOfInterest.length > 0 &&
          filter.areaOfInterest[0].length > 0
        ) {
          url += `&areaOfInterest=["${filter.areaOfInterest}"]`;
        }
        if (filter.rating > 0) {
          url += `&rating=${filter.rating}`;
        }
        if (filter.numberOfRating > 0) {
          url += `&numberOfRating=${filter.numberOfRating}`;
        }
        if (filter.sort) {
          url += `&sort=${filter.sort}`;
        }

        const { data } = await axios.get(url);

        setIdeas(data.ideas);
        setNumberOfIdeas(Math.ceil(data.nbHits / 6));
      } catch (error) {
        console.log(error);
      }
    };
    if (cookies && cookies.isLoggedIn) {
      fetch();
    }
  }, [filter, page]);

  const handleSelectChange = (event) => {
    const value = event.target.value;
    setFilter((prevFilter) => ({
      ...prevFilter,
      areaOfInterest: [value],
    }));
  };
  const handleSortChange = (event) => {
    setFilter((prevFilter) => ({
      ...prevFilter,
      sort: event.target.checked,
    }));
  };

  return (
    <>
      <Breadcrumb
        pageName="Filter Ideas Published"
        description="Filter and explore ideas based on author, area of interest, and rating to find exactly what you're looking for."
      />
      <div className="container">
        <div className="m-2 max-w-screen-md">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg dark:bg-gray-dark ">
            <h2 className="text-xl font-bold text-stone-700 dark:text-white">
              Apply filters
            </h2>
            <p className="mt-1 text-sm">Use filters to further refine search</p>
            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              <div className="flex flex-col">
                <label
                  htmlFor="name"
                  className="text-sm font-medium text-stone-600 dark:text-white"
                >
                  Title
                </label>
                <input
                  type="text"
                  id="name"
                  value={filter.name}
                  onChange={(e) =>
                    setFilter({ ...filter, name: e.target.value })
                  }
                  placeholder="Enter Title"
                  className="mt-2 block w-full rounded-md border border-gray-200 px-2 py-2 shadow-sm outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="manufacturer"
                  className="text-sm font-medium text-stone-600 dark:text-white"
                >
                  Author
                </label>
                <input
                  type="manufacturer"
                  id="manufacturer"
                  value={filter.author}
                  onChange={(e) =>
                    setFilter({ ...filter, author: e.target.value })
                  }
                  placeholder="Enter author name"
                  className="mt-2 block w-full rounded-md border border-gray-200 px-2 py-2 shadow-sm outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
              </div>

              {/* <div className="flex flex-col">
                <label
                  htmlFor="date"
                  className="text-sm font-medium text-stone-600 dark:text-white"
                >
                  Date of Entry
                </label>
                <input
                  type="date"
                  id="date"
                  className="mt-2 block w-full rounded-md border border-gray-200 px-2 py-2 shadow-sm outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
              </div> */}

              <div className="flex flex-col">
                <label
                  htmlFor="status"
                  className="text-sm font-medium text-stone-600 dark:text-white"
                >
                  Status
                </label>

                <select
                  id="status"
                  className="mt-2 block w-full rounded-md border border-gray-200 px-2 py-2 shadow-sm outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  onChange={handleSelectChange}
                >
                  <option value="">--select option--</option>
                  <option value="Technology and Innovation">
                    Technology and Innovation
                  </option>
                  <option value="Health and Medicine">
                    Health and Medicine
                  </option>
                  <option value="Education and Learning">
                    Education and Learning
                  </option>
                  <option value="Environment and Sustainability">
                    Environment and Sustainability
                  </option>
                  <option value="Business and Entrepreneurship">
                    Business and Entrepreneurship
                  </option>
                  <option value="Social and Community Development">
                    Social and Community Development
                  </option>
                  <option value="Arts and Culture">Arts and Culture</option>
                  <option value="Science and Research">
                    Science and Research
                  </option>
                  <option value="Finance and Economics">
                    Finance and Economics
                  </option>
                  <option value="Sports and Recreation">
                    Sports and Recreation
                  </option>
                  <option value="Entertainment and Media">
                    Entertainment and Media
                  </option>
                  <option value="Politics and Governance">
                    Politics and Governance
                  </option>
                  <option value="Food and Agriculture">
                    Food and Agriculture
                  </option>
                  <option value="Travel and Tourism">Travel and Tourism</option>
                  <option value="Fashion and Lifestyle">
                    Fashion and Lifestyle
                  </option>
                  <option value="Transportation and Logistics">
                    Transportation and Logistics
                  </option>
                  <option value="Real Estate and Urban Planning">
                    Real Estate and Urban Planning
                  </option>
                  <option value="Energy and Resources">
                    Energy and Resources
                  </option>
                  <option value="Human Rights and Advocacy">
                    Human Rights and Advocacy
                  </option>
                  <option value="Artificial Intelligence and Robotics">
                    Artificial Intelligence and Robotics
                  </option>
                </select>
              </div>
              <div className="mt-4 flex flex-col">
                <label
                  htmlFor="rating"
                  className="text-sm font-medium text-stone-600 dark:text-white"
                >
                  Rating
                </label>
                <input
                  type="range"
                  id="rating"
                  min="0"
                  max="5"
                  step="0.1"
                  value={filter.rating}
                  onChange={(e) =>
                    setFilter({ ...filter, rating: parseFloat(e.target.value) })
                  }
                  className="mt-2 block w-full rounded-md border border-gray-200 px-2 py-2 shadow-sm outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
                <span className="mt-2 text-sm text-stone-600 dark:text-white">
                  {filter.rating}
                </span>
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="numberOfRating"
                  className="text-sm font-medium text-stone-600 dark:text-white"
                >
                  Number of ratings
                </label>
                <input
                  type="number"
                  id="numberOfRating"
                  value={filter.numberOfRating}
                  onChange={(e) =>
                    setFilter({
                      ...filter,
                      numberOfRating: Number(e.target.value),
                    })
                  }
                  placeholder="Enter number of ratings"
                  className="mt-2 block w-full rounded-md border border-gray-200 px-2 py-2 shadow-sm outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
              </div>

              <div className="mt-4 flex flex-col">
                <label
                  htmlFor="sort"
                  className="text-sm font-medium text-stone-600 dark:text-white"
                >
                  Sort by Publish Date
                </label>
                <input
                  type="checkbox"
                  id="sort"
                  checked={filter.sort}
                  onChange={handleSortChange}
                  className="mt-2 block rounded border border-gray-200 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
              </div>
            </div>

            <div className="mt-6 grid w-full grid-cols-2 justify-end space-x-4 md:flex">
              <button
                onClick={() => {
                  setFilter({
                    name: "",
                    author: "",
                    areaOfInterest: [],
                    rating: 0,
                    numberOfRating: 0,
                    sort: false,
                  });
                }}
                className="rounded-lg bg-gray-200 px-8 py-2 font-medium text-gray-600 outline-none hover:opacity-90 focus:ring active:scale-95"
              >
                Reset
              </button>
              {/* <button className="rounded-lg bg-blue-600 px-8 py-2 font-medium text-white outline-none hover:opacity-90 focus:ring active:scale-95">
                Search
              </button> */}
            </div>
          </div>
        </div>
      </div>

      <section className="pb-[120px] pt-[120px]">
        <div className="container">
          <div className="-mx-4 flex flex-wrap justify-center">
            {ideas.map((idea) => {
              return (
                <div
                  key={idea.ideaId}
                  className="w-full px-4 md:w-2/3 lg:w-1/2 xl:w-1/3"
                >
                  <SingleBlog blog={idea} />
                </div>
              );
            })}
          </div>

          <div className="-mx-4 flex flex-wrap" data-wow-delay=".15s">
            <div className="w-full px-4">
              <ul className="flex items-center justify-center pt-8">
                {page > 1 && (
                  <li className="mx-1">
                    <a
                      onClick={() => setPage(page - 1)}
                      className="flex h-9 min-w-[36px] items-center justify-center rounded-md bg-body-color bg-opacity-[15%] px-4 text-sm text-body-color transition hover:bg-primary hover:bg-opacity-100 hover:text-white"
                    >
                      Prev
                    </a>
                  </li>
                )}
                {/* <li className="mx-1">
                  <a
                    href="#0"
                    className="flex h-9 min-w-[36px] items-center justify-center rounded-md bg-body-color bg-opacity-[15%] px-4 text-sm text-body-color transition hover:bg-primary hover:bg-opacity-100 hover:text-white"
                  >
                    1
                  </a>*/}
                {page < numberOfIdeas && (
                  <li className="mx-1">
                    <a
                      onClick={(e) => setPage(page + 1)}
                      className="flex h-9 min-w-[36px] items-center justify-center rounded-md bg-body-color bg-opacity-[15%] px-4 text-sm text-body-color transition hover:bg-primary hover:bg-opacity-100 hover:text-white"
                    >
                      Next
                    </a>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Blog;
