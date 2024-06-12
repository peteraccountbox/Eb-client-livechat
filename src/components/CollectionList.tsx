import React, {
  FC,
  createContext,
  useContext,
  useEffect,
  useState,
  useTransition,
} from "react";
import { getReq } from "../request";
import { KB_COLLECTION_URL_PATH, KB_SEARCH_URL_PATH } from "../globals";
import CollectionItem from "./CollectionItem";
import ArticleItem from "./ArticleItem";
import { AppContext } from "../appContext";
import CloseWidgetPanel from "./CloseWidgetPanel";
import { ArticleType, CollectionType } from "../Models";

export interface CollectionListComponentProps {
  searchTxt: string;
  setSearchTxt: (arg0: string) => void;
  articles: ArticleType[];
  setArticles: (arg0: ArticleType[]) => void;
  openCollection: (collectionId: Number) => void;
  collections: CollectionType[];
  setCollections: (arg0: CollectionType[]) => void;
  openArticle: (articleId: Number) => void;
}

const CollectionList: FC<CollectionListComponentProps> = (props) => {
  const parentContext = useContext(AppContext);
  const {
    searchTxt,
    setSearchTxt,
    articles,
    setArticles,
    openCollection,
    collections,
    setCollections,
    openArticle,
  } = props;
  const [display, setDisplay] = useState(searchTxt);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (searchTxt) {
      setLoading(true);
      setFetching(false);
    }
    const wait = searchTxt
      ? getReq(KB_SEARCH_URL_PATH, { q: searchTxt })
      : getReq(KB_COLLECTION_URL_PATH, {});
    wait
      .then((response) => {
        let newSearchItems = response.data;
        console.log(response.data);
        setFetching(false);
        setCollections([
          ...newSearchItems.filter(
            (data: ArticleType | CollectionType) =>
              data.entiy_group_name == "kb_collection"
          ),
        ]);
        setArticles([
          ...newSearchItems.filter(
            (data: ArticleType | CollectionType) =>
              data.entiy_group_name == "kb_article"
          ),
        ]);
        searchTxt && setLoading(false);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  useEffect(() => {
    if (
      display.length < searchTxt.length ||
      (display.length == searchTxt.length && display != searchTxt)
    )
      setLoading(true);
    else if (display.length == searchTxt.length) return;
    if (searchTxt == "") {
      setFetching(true);
      setDisplay(searchTxt);
      setCollections([]);
      setArticles([]);
    }
    const timeoutId = setTimeout(() => {
      setLoading(true);
      setFetching(true);
      setDisplay(searchTxt);
      const wait = searchTxt
        ? getReq(KB_SEARCH_URL_PATH, { q: searchTxt })
        : getReq(KB_COLLECTION_URL_PATH, {});
      wait
        .then((response) => {
          let newSearchItems = response.data;
          console.log(response.data);
          setCollections([
            ...newSearchItems.filter(
              (data: ArticleType | CollectionType) =>
                data.entiy_group_name == "kb_collection"
            ),
          ]);
          setArticles([
            ...newSearchItems.filter(
              (data: ArticleType | CollectionType) =>
                data.entiy_group_name == "kb_article"
            ),
          ]);
          setLoading(false);
          response.data.length == 0 && !searchTxt && setFetching(false);
        })
        .catch((e) => {
          console.log(e);
        });
    }, 2000); // Adjust the delay time as needed

    return () => clearTimeout(timeoutId);
  }, [searchTxt]);

  useEffect(() => {
    if (collections.length > 0) setFetching(false);
  }, [collections]);

  const search = (value: string) => {
    setSearchTxt(value);
  };

  return (
    <div className="overflow___hiiden chat__help-collection-wrapper">
      <div
        className={`chat__help chat__help-article ${
          collections.length == 0 && articles.length == 0 ? "show-flex" : ""
        }`}
      >
        <div className="chat__conversation chat__create-ticket">
          <div className="chat__header  chat__help-header">
            <div className="ticket__header-action">
              <div className="chat__help-action" />

              <div className="chat__help-user">
                <h3 className="chat__help-user-name">Help </h3>
              </div>
              <div className="chat__help-end">
                <CloseWidgetPanel />
              </div>
            </div>

            <div className="icon-input">
              <input
                className="icon-input__text-field"
                type="text"
                placeholder="Search for help"
                value={searchTxt}
                onChange={(e) => search(e.target.value)}
              />

              <span
                className="icon-input__icon"
                onClick={() => searchTxt && !loading && search("")}
              >
                {loading ? (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
                    <rect fill="#FFF" width="100%" height="100%" />
                    <radialGradient
                      id="a12"
                      cx=".66"
                      fx=".66"
                      cy=".3125"
                      fy=".3125"
                      gradientTransform="scale(1.5)"
                    >
                      <stop offset="0" stop-color="#6C757D"></stop>
                      <stop
                        offset=".3"
                        stop-color="#6C757D"
                        stop-opacity=".9"
                      ></stop>
                      <stop
                        offset=".6"
                        stop-color="#6C757D"
                        stop-opacity=".6"
                      ></stop>
                      <stop
                        offset=".8"
                        stop-color="#6C757D"
                        stop-opacity=".3"
                      ></stop>
                      <stop
                        offset="1"
                        stop-color="#6C757D"
                        stop-opacity="0"
                      ></stop>
                    </radialGradient>
                    <circle
                      transform-origin="center"
                      fill="none"
                      stroke="url(#a12)"
                      stroke-width="15"
                      stroke-linecap="round"
                      stroke-dasharray="200 1000"
                      stroke-dashoffset="0"
                      cx="100"
                      cy="100"
                      r="70"
                    >
                      <animateTransform
                        type="rotate"
                        attributeName="transform"
                        calcMode="spline"
                        dur="2"
                        values="360;0"
                        keyTimes="0;1"
                        keySplines="0 0 1 1"
                        repeatCount="indefinite"
                      ></animateTransform>
                    </circle>
                    <circle
                      transform-origin="center"
                      fill="none"
                      opacity=".2"
                      stroke="#6C757D"
                      stroke-width="15"
                      stroke-linecap="round"
                      cx="100"
                      cy="100"
                      r="70"
                    ></circle>
                  </svg>
                ) : !searchTxt ? (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    className="search-icon"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="7.5"
                      cy="7.5"
                      r="4.625"
                      stroke="currentColor"
                      stroke-width="1.75"
                    ></circle>
                    <path
                      d="M13.3813 14.6187C13.723 14.9604 14.277 14.9604 14.6187 14.6187C14.9604 14.277 14.9604 13.723 14.6187 13.3813L13.3813 14.6187ZM10.3813 11.6187L13.3813 14.6187L14.6187 13.3813L11.6187 10.3813L10.3813 11.6187Z"
                      fill="currentColor"
                    ></path>
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-x-lg"
                    viewBox="0 0 16 16"
                  >
                    <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"></path>
                  </svg>
                )}
              </span>
            </div>
          </div>

          <div className="help__collections">
            {collections.length > 0 || articles.length > 0 ? (
              <>
                {!searchTxt && collections.length > 0 && (
                  <h3 className="help__collections-header">
                    {collections.length} collections
                  </h3>
                )}
                <ul className="help__collections-list">
                  {collections.map((collection) => (
                    <CollectionItem
                      collection={collection}
                      openCollection={openCollection}
                    />
                  ))}

                  {articles.map((article) => (
                    <ArticleItem article={article} openArticle={openArticle} />
                  ))}
                </ul>
              </>
            ) : (
              <div className="help__collections-scrollbar">
                <div className="pad-content">
                  {!display ? (
                    fetching ? (
                      <>
                        <div className="chat__form-loader1">
                          <span></span>
                          <span></span>
                          <span></span>
                          <span></span>
                        </div>
                      </>
                    ) : (
                      <>
                        <img
                          className="pad-no-content-img"
                          src="https://d2p078bqz5urf7.cloudfront.net/cloud/assets/livechat/no-articles-yet.svg"
                          alt="No articles"
                        />
                        <h2 className="pad-content-title">No Articles</h2>
                        <p className="pad-text">
                          Access to the articles is currently unavailable.
                        </p>
                      </>
                    )
                  ) : (
                    <>
                      Try Again No results for{" "}
                      <p className="pad-text">'{display}'</p>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionList;
