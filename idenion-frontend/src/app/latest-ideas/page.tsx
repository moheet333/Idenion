"use client";
import SingleBlog from "@/components/Blog/SingleBlog";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { useEffect, useState } from "react";
import axios from "axios";
import "../axios.js";
import { useRouter } from "next/navigation";
import { useCookies } from "react-cookie";

const Blog = () => {
  const router = useRouter();

  const [ideas, setIdeas] = useState([]);
  const [page, setPage] = useState(1);
  const [numberOfIdeas, setNumberOfIdeas] = useState(0);
  const [cookies, setCookie, removeCookie] = useCookies(["isLoggedIn"]);

  useEffect(() => {
    if (!cookies || !cookies.isLoggedIn) {
      router.push("/signin");
    }
  }, []);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await axios.get(`idea/getAllIdeas?page=${page}`);
        setIdeas(data.ideas);
        setNumberOfIdeas(Math.ceil(Number(data.nbHits / 6)));
      } catch (error) {
        console.log(error);
      }
    };
    if (cookies && cookies.isLoggedIn) {
      fetch();
    }
  }, [page]);

  return (
    <>
      <Breadcrumb
        pageName="Latest Ideas Published"
        description="Discover the newest and most innovative ideas shared by our vibrant community."
      />

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
