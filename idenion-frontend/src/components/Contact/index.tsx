"use client";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import "../../app/axios.js";
import { useRouter } from "next/navigation";
import Icons from "./Icons";
import { useCookies } from "react-cookie";

const Contact = () => {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [selectedThumbnail, setSelectedThumbnail] = useState<File | null>(null);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [cookies, setCookie, removeCookie] = useCookies(["isLoggedIn"]);

  useEffect(() => {
    if (!cookies || !cookies.isLoggedIn) {
      router.push("/signin");
    }
  }, []);

  const inputRef = useRef(null);

  const tags = [
    "Technology and Innovation",
    "Health and Medicine",
    "Education and Learning",
    "Environment and Sustainability",
    "Business and Entrepreneurship",
    "Social and Community Development",
    "Arts and Culture",
    "Science and Research",
    "Finance and Economics",
    "Sports and Recreation",
    "Entertainment and Media",
    "Politics and Governance",
    "Food and Agriculture",
    "Travel and Tourism",
    "Fashion and Lifestyle",
    "Transportation and Logistics",
    "Real Estate and Urban Planning",
    "Energy and Resources",
    "Human Rights and Advocacy",
    "Artificial Intelligence and Robotics",
  ];

  const filteredTags = tags.filter(
    (item) =>
      item?.toLocaleLowerCase()?.includes(query.toLocaleLowerCase()?.trim()) &&
      !selected.includes(item),
  );

  const isDisable =
    !query?.trim() ||
    selected.filter(
      (item) =>
        item?.toLocaleLowerCase()?.trim() ===
        query?.toLocaleLowerCase()?.trim(),
    )?.length;

  const uploadToPresignedUrl = async (presignedUrl, selectedFile) => {
    const uninterceptedAxiosInstance = axios.create();
    const uploadResponse = await uninterceptedAxiosInstance.put(
      presignedUrl,
      selectedFile,
      {
        headers: {
          "Content-Type": selectedFile.contentType,
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );
          setUploadProgress(percentCompleted);
          console.log(`Upload Progress: ${percentCompleted}%`);
        },
      },
    );
    console.log(uploadResponse);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selected.length == 0) {
      alert("Please select atleast single area of interest");
      return;
    }
    setIsLoading(true);

    try {
      const { data } = await axios.post(`idea/publishIdea`, {
        videoFilename: selectedVideo.name,
        videoContentType: selectedVideo.type,
        thumbnailFilename: selectedThumbnail.name,
        thumbnailContentType: selectedThumbnail.type,
        name: title,
        description: description,
        areaOfInterest: selected,
      });
      await uploadToPresignedUrl(data.videoUrl, selectedVideo);
      await uploadToPresignedUrl(data.thumbnailUrl, selectedThumbnail);
      setIsLoading(false);
      setTitle("");
      setDescription("");
    } catch (error) {
      console.log(error);
    }
  };

  if (isLoading) {
    return (
      <div className="container">
        <div className="mb-12 rounded-sm bg-white px-8 py-11 shadow-three dark:bg-gray-dark sm:p-[55px] lg:mb-5 lg:px-8 xl:p-[55px]">
          <div className="mb-1 flex justify-between">
            <span className="text-base font-medium text-blue-700 dark:text-white">
              Uploading
            </span>
            <span className="text-sm font-medium text-blue-700 dark:text-white">
              {uploadProgress}%
            </span>
          </div>
          <div className="h-2.5 w-full rounded-full bg-gray-200 dark:bg-gray-700">
            <div
              className="h-2.5 rounded-full bg-blue-600"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section id="contact" className="overflow-hidden py-16 md:py-20 lg:py-28">
      <div className="container">
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4">
            <div
              className="mb-12 rounded-sm bg-white px-8 py-11 shadow-three dark:bg-gray-dark sm:p-[55px] lg:mb-5 lg:px-8 xl:p-[55px]"
              data-wow-delay=".15s
              "
            >
              <h2 className="mb-3 text-2xl font-bold text-black dark:text-white sm:text-3xl lg:text-2xl xl:text-3xl">
                Fill the below form to publish your own idea!
              </h2>
              <p className="mb-12 text-base font-medium text-body-color">
                Our support team will get back to you ASAP via email.
              </p>
              <form onSubmit={handleSubmit}>
                <div className="-mx-4 flex flex-wrap">
                  <div className="w-full px-4 md:w-1/2">
                    <div className="mb-8">
                      <label
                        htmlFor="name"
                        className="mb-3 block text-sm font-medium text-dark dark:text-white"
                      >
                        Title
                      </label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter your title"
                        className="border-stroke w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary dark:focus:shadow-none"
                        required
                      />
                    </div>
                  </div>
                  <div className="w-full px-4 md:w-1/2">
                    <div className="mb-8">
                      <label
                        htmlFor="email"
                        className="mb-3 block text-sm font-medium text-dark dark:text-white"
                      >
                        Area/s of Interests
                      </label>

                      <div className="border-stroke w-full rounded-sm border bg-[#f8f8f8] px-3 py-3 text-base text-body-color outline-none focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary dark:focus:shadow-none">
                        {selected?.length ? (
                          <div className="relative flex flex-wrap gap-1 rounded-sm text-xs dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary dark:focus:shadow-none">
                            {selected.map((tag) => {
                              return (
                                <div
                                  key={tag}
                                  className="text-s flex w-fit items-center gap-2 rounded-full border border-gray-400 px-2
                  py-0.5 text-base text-body-color text-gray-500"
                                >
                                  {tag}
                                  <div
                                    onMouseDown={(e) => e.preventDefault()}
                                    onClick={() =>
                                      setSelected(
                                        selected.filter((i) => i !== tag),
                                      )
                                    }
                                  >
                                    <Icons.Close />
                                  </div>
                                </div>
                              );
                            })}
                            <div className="w-full text-right">
                              <span
                                className="cursor-pointer text-gray-400"
                                onClick={() => {
                                  setSelected([]);
                                  inputRef.current?.focus();
                                }}
                              >
                                Clear all
                              </span>
                            </div>
                          </div>
                        ) : null}
                        <div className="card flex items-center justify-between gap-2.5 p-3">
                          <Icons.Search />
                          <input
                            ref={inputRef}
                            type="text"
                            value={query}
                            onChange={(e) =>
                              setQuery(e.target.value.trimStart())
                            }
                            placeholder="Search tags"
                            className="flex-1 bg-transparent text-sm caret-rose-600"
                            onFocus={() => setMenuOpen(true)}
                            onBlur={() => setMenuOpen(false)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && !isDisable) {
                                setSelected((prev) => [...prev, query]);
                                setQuery("");
                                setMenuOpen(true);
                              }
                            }}
                          />
                        </div>

                        {/* Menu's */}
                        {menuOpen ? (
                          <div className="card scrollbar-thin scrollbar-track-slate-50 scrollbar-thumb-slate-200 absolute mt-2 flex max-h-52 w-96 overflow-y-auto bg-gray-dark p-1 shadow-three">
                            <ul className="w-full">
                              {filteredTags?.length ? (
                                filteredTags.map((tag, i) => (
                                  <li
                                    key={tag}
                                    className="w-full cursor-pointer rounded-md p-2 hover:bg-rose-50 hover:text-rose-500"
                                    onMouseDown={(e) => e.preventDefault()}
                                    onClick={() => {
                                      setMenuOpen(true);
                                      setSelected((prev) => [...prev, tag]);
                                      setQuery("");
                                    }}
                                  >
                                    {tag}
                                  </li>
                                ))
                              ) : (
                                <li className="p-2 text-gray-500">
                                  No options available
                                </li>
                              )}
                            </ul>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                  <div className="w-full px-4 md:w-1/2">
                    <div className="mb-8">
                      <label
                        htmlFor="email"
                        className="mb-3 block text-sm font-medium text-dark dark:text-white"
                      >
                        Video describing your idea
                      </label>
                      <input
                        type="file"
                        onChange={(e) => setSelectedVideo(e.target.files[0])}
                        placeholder="Enter your Video file"
                        className="border-stroke w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary dark:focus:shadow-none"
                        accept="video/*"
                        required
                      />
                    </div>
                  </div>
                  <div className="w-full px-4 md:w-1/2">
                    <div className="mb-8">
                      <label
                        htmlFor="email"
                        className="mb-3 block text-sm font-medium text-dark dark:text-white"
                      >
                        Your video thumbnail
                      </label>
                      <input
                        type="file"
                        onChange={(e) =>
                          setSelectedThumbnail(e.target.files[0])
                        }
                        placeholder="Enter your thumbnail"
                        className="border-stroke w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary dark:focus:shadow-none"
                        accept="image/*"
                        required
                      />
                    </div>
                  </div>

                  <div className="w-full px-4">
                    <div className="mb-8">
                      <label
                        htmlFor="message"
                        className="mb-3 block text-sm font-medium text-dark dark:text-white"
                      >
                        Description
                      </label>
                      <textarea
                        name="message"
                        rows={5}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter your Description"
                        className="border-stroke w-full resize-none rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary dark:focus:shadow-none"
                        required
                      ></textarea>
                    </div>
                  </div>
                  <div className="w-full px-4">
                    <button
                      type="submit"
                      className="rounded-sm bg-primary px-9 py-4 text-base font-medium text-white shadow-submit duration-300 hover:bg-primary/90 dark:shadow-submit-dark"
                    >
                      Submit Ticket
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
          {/* <div className="w-full px-4 lg:w-5/12 xl:w-4/12">
            <NewsLatterBox />
          </div> */}
        </div>
      </div>
    </section>
  );
};

export default Contact;
