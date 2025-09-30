import React, { useContext, useEffect, useState } from "react";
import { HelpCenterItemSchema } from "../../Models";
import CollectionItemV2 from "./CollectionItemV2";
import ArticleItemV2 from "./ArticleItemV2";
import ArticleV2 from "./ArticleV2";
import { getReq } from "../../request";
import {
  KB_COLLECTION_CHILDREN_BY_ID,
  KB_SEARCH_URL_PATH_V2,
} from "../../globals";
import CloseWidgetPanel from "../CloseWidgetPanel";
import { AppContext } from "../../appContext";
import { resizeFrame } from "../../Utils";
import { PromtWidth } from "../../App";

type Props = {
  items: HelpCenterItemSchema[];
  searchTxt?: string;
  setSearchTxt?: (value: string) => void;
};

// Type for navigation history
type NavigationHistoryItem = {
  parentId: string | null;
  collectionId: string | null;
  title: string;
  description?: string;
};

const CollectionDashboard = ({
  items,
  searchTxt = "",
  setSearchTxt,
}: Props) => {
  const parentContext = useContext(AppContext);
  const setPromtWidth = parentContext.setPromtWidth;
  const promtWidth = parentContext.promtWidth;

  // State to track the current view
  const [currentView, setCurrentView] = useState<
    "main" | "collection" | "article"
  >("main");

  // State to store the current items being displayed (could be main items, collection children, or a single article)
  const [displayItems, setDisplayItems] =
    useState<HelpCenterItemSchema[]>(items);

  // State to store the current collection being viewed
  const [currentCollection, setCurrentCollection] =
    useState<HelpCenterItemSchema | null>(null);

  // State to store the current article when in article view
  const [currentArticle, setCurrentArticle] = useState<any>(null);

  // State to track loading status
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // State for search functionality
  const [display, setDisplay] = useState(searchTxt);
  const [loading, setLoading] = useState(false);

  // State for search results
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // State to store navigation history for back navigation
  const [navigationHistory, setNavigationHistory] = useState<
    NavigationHistoryItem[]
  >([
    {
      parentId: null,
      collectionId: null,
      title: "Help Center",
      description: "",
    },
  ]);

  // Check sessionStorage on component mount to restore previous collection view
  useEffect(() => {
    const savedCollectionId = sessionStorage.getItem("currentCollectionId");
    const savedArticleId = sessionStorage.getItem("currentArticleId");
    const savedNavigationHistory = sessionStorage.getItem("navigationHistory");

    // Restore navigation history if available
    let parsedHistory: NavigationHistoryItem[] = [
      {
        parentId: null,
        collectionId: null,
        title: "Help Center",
        description: "",
      },
    ];
    if (savedNavigationHistory) {
      try {
        const parsed = JSON.parse(savedNavigationHistory);
        if (Array.isArray(parsed) && parsed.length > 0) {
          parsedHistory = parsed;
          setNavigationHistory(parsed);
        }
      } catch (e) {
        console.log("Error parsing saved navigation history:", e);
      }
    }

    // Check if we have a saved article ID
    if (savedArticleId) {
      setCurrentArticle({ id: savedArticleId } as any);
      setCurrentView("article");
      return; // Exit early as article view takes precedence
    }

    // Check if we have a saved collection ID
    if (savedCollectionId) {
      // Fetch the collection data using the saved ID
      setIsLoading(true);

      getReq(`${KB_COLLECTION_CHILDREN_BY_ID}/${savedCollectionId}`, {})
        .then((response) => {
          if (response && response.data) {
            // Ensure response.data is an array
            const responseData = Array.isArray(response.data)
              ? response.data
              : [];

            // Update display items with the fetched collections
            setDisplayItems(responseData);

            // Set view to collection
            setCurrentView("collection");

            // Find the collection in the navigation history to set as current collection
            const collectionEntry = parsedHistory.find(
              (item) => item.collectionId === savedCollectionId
            );
            if (collectionEntry) {
              setCurrentCollection({
                id: savedCollectionId,
                title: collectionEntry.title,
                description: collectionEntry.description || "",
                parentId: collectionEntry.parentId,
                type: "COLLECTION",
              } as HelpCenterItemSchema);
            }
          }
          setIsLoading(false);
        })
        .catch((e) => {
          console.log("Error fetching saved collection:", e);
          setIsLoading(false);
        });
    }
  }, []); // Empty dependency array ensures this runs only once on mount

  // Update displayItems when items prop changes
  useEffect(() => {
    if (currentView === "main") {
      // Ensure items is always an array
      const safeItems = Array.isArray(items) ? items : [];
      setDisplayItems(safeItems);
    }
  }, [items, currentView]);

  // Handle search text changes
  useEffect(() => {
    if (!setSearchTxt) return; // Skip if search functionality is not provided

    if (
      display.length < searchTxt.length ||
      (display.length == searchTxt.length && display != searchTxt)
    )
      setLoading(true);
    else if (display.length == searchTxt.length) return;

    const timeoutId = setTimeout(() => {
      setLoading(true);
      setDisplay(searchTxt);

      const wait = searchTxt
        ? getReq(KB_SEARCH_URL_PATH_V2, { q: searchTxt })
        : getReq(KB_COLLECTION_CHILDREN_BY_ID, {});

      wait
        .then((response) => {
          if (searchTxt) {
            // Handle search results
            let articleResults = [];

            // Check if response.data is an array (direct search results)
            if (Array.isArray(response.data)) {
              articleResults = response.data.filter(
                (item: any) => item.status === "PUBLISHED"
              );
            }
            // Check if response.data.data is an array (v2 API format)
            else if (response.data?.data && Array.isArray(response.data.data)) {
              articleResults = response.data.data.filter(
                (item: any) =>
                  item.type === "ARTICLE" || item.status === "PUBLISHED"
              );
            }

            setSearchResults(articleResults);
            setIsSearching(true);
          } else {
            // Handle regular display items (for v2 API)
            if (
              response.data?.version &&
              response.data?.version.toLowerCase() === "v2"
            ) {
              setDisplayItems(response?.data?.data || []);
            }
            setSearchResults([]);
            setIsSearching(false);
          }

          setLoading(false);
        })
        .catch((e) => {
          console.log(e);
          setSearchResults([]);
          setIsSearching(false);
          setLoading(false);
        });
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [searchTxt]);

  // Fetch collections by parent ID
  const fetchCollectionsByParentId = (parentId: string | null) => {
    setIsLoading(true);

    // If parentId is null, we're fetching root collections
    const endpoint = parentId
      ? `${KB_COLLECTION_CHILDREN_BY_ID}/${parentId}`
      : KB_COLLECTION_CHILDREN_BY_ID;

    getReq(endpoint, {})
      .then((response) => {
        if (response && response.data) {
          // Ensure response.data is an array
          const responseData = Array.isArray(response.data)
            ? response.data
            : [];

          // Update display items with the fetched collections
          setDisplayItems(responseData);

          // If we're going back to root, clear current collection and set view to main
          if (!parentId) {
            setCurrentCollection(null);
            setCurrentView("main");
          } else {
            // We're viewing a collection's children, stay in collection view
            setCurrentView("collection");
          }
        } else {
          // If no data in response, set empty array
          setDisplayItems([]);
        }
        setIsLoading(false);
      })
      .catch((e) => {
        console.log("Error fetching collections:", e);
        setIsLoading(false);

        // On error, go back to root collections
        setDisplayItems(Array.isArray(items) ? items : []);
        setCurrentCollection(null);
        setCurrentView("main");
      });
  };

  // Handle collection click
  const handleCollectionClick = (
    collectionId: string,
    children: HelpCenterItemSchema[]
  ) => {
    // Find the clicked collection
    const clickedCollection = displayItems.find(
      (item) => item.id === collectionId
    );

    if (clickedCollection) {
      // Set loading to false since we received the children data
      setIsLoading(false);

      // Set the current collection
      setCurrentCollection(clickedCollection);

      // Update display items with the children
      setDisplayItems(children);

      // Set view to collection
      setCurrentView("collection");

      // Create updated navigation history
      const updatedHistory = [
        ...navigationHistory,
        {
          parentId: clickedCollection.parentId || null,
          collectionId: clickedCollection.id,
          title: clickedCollection.title,
          description: clickedCollection.description || "",
        },
      ];

      // Add to navigation history with description
      setNavigationHistory(updatedHistory);

      // Save to sessionStorage for persistence across page refreshes
      sessionStorage.setItem("currentCollectionId", collectionId);
      sessionStorage.setItem(
        "navigationHistory",
        JSON.stringify(updatedHistory)
      );
    }
  };

  // Handle collection click start (when user clicks but before API call completes)
  const handleCollectionClickStart = (collectionId: string) => {
    // Set loading state to true when collection is clicked
    setIsLoading(true);
  };

  // Handle article click
  const handleArticleClick = (articleId: string) => {
    // Find the clicked article to get its details
    const clickedArticle = displayItems.find((item) => item.id === articleId);

    // Set view to article
    setCurrentView("article");

    // Set the current article ID
    setCurrentArticle({ id: articleId } as any);

    // Add to navigation history if we found the article in display items
    if (clickedArticle) {
      const updatedHistory = [
        ...navigationHistory,
        {
          parentId: currentCollection ? currentCollection.id : null,
          collectionId: null,
          title: clickedArticle.title,
          description: clickedArticle.description || "",
        },
      ];

      setNavigationHistory(updatedHistory);

      // Save article ID and updated navigation history to sessionStorage
      sessionStorage.setItem("currentArticleId", articleId);
      sessionStorage.setItem(
        "navigationHistory",
        JSON.stringify(updatedHistory)
      );

      // Keep the collection ID in sessionStorage if we're viewing an article within a collection
      if (currentCollection && currentCollection.id) {
        sessionStorage.setItem("currentCollectionId", currentCollection.id);
      }
    }
  };

  // Handle search article selection
  const handleSearchArticleSelect = (article: any) => {
    // Set view to article
    setCurrentView("article");

    // Set the current article ID
    setCurrentArticle({ id: article.id } as any);

    // Add to navigation history
    const updatedHistory = [
      ...navigationHistory,
      {
        parentId: currentCollection ? currentCollection.id : null,
        collectionId: null,
        title: article.title,
        description: article.description || "",
      },
    ];

    setNavigationHistory(updatedHistory);

    // Save article ID and updated navigation history to sessionStorage
    sessionStorage.setItem("currentArticleId", article.id);
    sessionStorage.setItem("navigationHistory", JSON.stringify(updatedHistory));

    // Clear search text and results
    if (setSearchTxt) {
      setSearchTxt("");
    }
    setSearchResults([]);
    setIsSearching(false);
  };

  // Handle back navigation
  const handleBackNavigation = () => {
    // If we only have the root in history, we can't go back further
    if (navigationHistory.length <= 1) {
      return;
    }

    // Remove the current level from history
    const newHistory = [...navigationHistory];
    newHistory.pop();
    setNavigationHistory(newHistory);

    // Get the previous level
    const previousLevel = newHistory[newHistory.length - 1];

    if (currentView === "article") {
      if (promtWidth === PromtWidth.Large) {
        setPromtWidth(PromtWidth.Small);
      }
      // Going back from article to collection or main view
      setCurrentView(previousLevel.collectionId ? "collection" : "main");
      setCurrentArticle(null);

      // Remove article ID from sessionStorage
      sessionStorage.removeItem("currentArticleId");

      // Update navigation history in sessionStorage
      sessionStorage.setItem("navigationHistory", JSON.stringify(newHistory));
    } else if (currentView === "collection") {
      // If we're going back to the root level
      if (
        previousLevel.parentId === null &&
        previousLevel.collectionId === null
      ) {
        fetchCollectionsByParentId(null); // Fetch root collections

        // Clear sessionStorage when going back to main view
        sessionStorage.removeItem("currentCollectionId");
        sessionStorage.removeItem("navigationHistory");
      } else {
        // Use the parentId to fetch its children
        fetchCollectionsByParentId(
          previousLevel.collectionId || previousLevel.parentId
        );

        // Update sessionStorage with the new current collection and history
        if (previousLevel.collectionId) {
          sessionStorage.setItem(
            "currentCollectionId",
            previousLevel.collectionId
          );
          sessionStorage.setItem(
            "navigationHistory",
            JSON.stringify(newHistory)
          );
        }
      }
    }
  };

  // Back button is now rendered in the header

  // Render the header description
  const renderHeader = () => {
    if (currentView === "collection") {
      const currentLevel = navigationHistory[navigationHistory.length - 1];
      return (
        currentLevel.description && (
          <>
            <header className="collection-header">
              <h2 className="title">{currentLevel.title}</h2>
              {currentLevel.description && (
                <p className="desc">{currentLevel.description}</p>
              )}
            </header>
          </>
        )
      );
    } else {
      return <></>;
    }
  };

  // Render the article view
  const renderArticleView = () => {
    if (!currentArticle || !currentArticle.id) {
      return (
        <div className="article-view">
          <div className="article-content">
            <p>Loading article content...</p>
          </div>
        </div>
      );
    }

    return (
      <ArticleV2
        articleId={currentArticle.id.toString()}
        onBackClick={handleBackNavigation}
      />
    );
  };

  // Render the collection/items view
  const renderItemsView = () => {
    // If we're searching, show search results
    if (isSearching) {
      if (searchResults.length > 0) {
        return (
          <>
            <ul className="help__collections-list">
              {searchResults.map((article) => (
                <li key={article.id}>
                  <div
                    className="help__collection-item"
                    onClick={() => handleSearchArticleSelect(article)}
                    style={{
                      cursor: "pointer",
                      padding: "16px",
                      borderBottom: "1px solid #f0f0f0",
                    }}
                  >
                    <div
                      style={{
                        fontWeight: "500",
                        fontSize: "16px",
                        marginBottom: "8px",
                      }}
                    >
                      {article.title}
                    </div>
                    {article.path && article.path.length > 0 && (
                      <div style={{ fontSize: "14px", color: "#666" }}>
                        {article.path.map((p: any) => p.name).join(" > ")}
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </>
        );
      } else {
        return (
          <div className="help__collections-scrollbar">
            <div className="pad-content">
              <div style={{ textAlign: "center", padding: "40px 20px" }}>
                <h2 className="pad-content-title">No Results Found</h2>
                <p className="pad-text">
                  No articles found for "{searchTxt}". Try different keywords.
                </p>
              </div>
            </div>
          </div>
        );
      }
    }

    // Regular collection/article view
    const itemsArray = Array.isArray(displayItems) ? displayItems : [];
    const collections = itemsArray.filter(
      (item) => item && item.type === "COLLECTION"
    );
    const articles = itemsArray.filter(
      (item) => item && item.type === "ARTICLE"
    );

    if (collections.length > 0 || articles.length > 0) {
      return (
        <>
          <ul className="help__collections-list">
            {collections.map((item) => (
              <li key={item.id}>
                <CollectionItemV2
                  collection={item}
                  onCollectionClick={handleCollectionClick}
                  onCollectionClickStart={handleCollectionClickStart}
                />
              </li>
            ))}

            {articles.map((item) => (
              <li key={item.id}>
                <ArticleItemV2
                  article={item}
                  onArticleClick={handleArticleClick}
                />
              </li>
            ))}
          </ul>
        </>
      );
    } else {
      return (
        <div className="help__collections-scrollbar">
          <div className="pad-content">
            {isLoading ? (
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
            )}
          </div>
        </div>
      );
    }
  };

  // Search function
  const search = (value: string) => {
    if (setSearchTxt) {
      setSearchTxt(value);
    }

    // Clear search results when search is cleared
    if (!value) {
      setSearchResults([]);
      setIsSearching(false);
    }
  };

  return (
    <div className="overflow___hiiden chat__help-collection-wrapper">
      <div
        className={`chat__help chat__help-article ${
          displayItems.length === 0 ? "show-flex" : ""
        }`}
      >
        <div className="chat__conversation chat__create-ticket">
          <div
            className={`chat__header  ${
              currentView === "main" ? "chat__help-header" : ""
            } ${currentView === "article" ? "chat__help__article-header" : ""}`}
          >
            <div className="ticket__header-action">
              {currentView !== "main" && (
                <div className="chat__help-action">
                  <div
                    data-trigger="all"
                    className="chat__header-back"
                    onClick={handleBackNavigation}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="none"
                      viewBox="0 0 24 24"
                      color="currentColor"
                    >
                      <path
                        stroke="#fff"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="1.7"
                        d="m14 18-6-6 6-6"
                      ></path>
                    </svg>
                  </div>
                </div>
              )}
              {currentView === "main" && <div className="chat__help-action" />}

              <div className="chat__help-user">
                <h3 className="chat__help-user-name">Help </h3>
              </div>
              <div className="chat__help-end">
                <CloseWidgetPanel />
              </div>
            </div>

            {currentView === "main" && (
              <div className="icon-input">
                <input
                  className="icon-input__text-field"
                  type="text"
                  placeholder="Search for help"
                  value={searchTxt}
                  onChange={(e) => search(e.target.value)}
                  disabled={!setSearchTxt}
                />

                <span
                  className="icon-input__icon"
                  onClick={() => searchTxt && !loading && search("")}
                >
                  {loading ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 200 200"
                    >
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
            )}

            {currentView === "article" && (
              <div data-trigger="all" className="chat__header-toggle-expansion">
                <div
                  className="chat__header-icon chat__header-expand-icon"
                  onClick={() => {
                    resizeFrame(
                      promtWidth && promtWidth == PromtWidth.Large
                        ? "WINDOW_OPENED"
                        : "WINDOW_OPENED_LARGE"
                    );
                    setPromtWidth(
                      promtWidth == PromtWidth.Large
                        ? PromtWidth.Small
                        : PromtWidth.Large
                    );
                  }}
                >
                  {promtWidth == PromtWidth.Large ? (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="expanded-svg"
                    >
                      <path
                        d="M1 1.00073L6 6.00073"
                        stroke="#ffffff"
                        stroke-width="1.7"
                      ></path>
                      <path
                        d="M1.5 6.50073L6.5 6.50073L6.5 1.50073"
                        stroke="#ffffff"
                        stroke-width="1.75"
                      ></path>
                      <path
                        d="M10 10.0017L15 15.0017"
                        stroke="#ffffff"
                        stroke-width="1.75"
                      ></path>
                      <path
                        d="M9.5 14.5017L9.5 9.50171L14.5 9.50171"
                        stroke="#ffffff"
                        stroke-width="1.75"
                      ></path>
                    </svg>
                  ) : (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="expand-svg"
                    >
                      <path
                        d="M1.99902 2.00073L6.99903 7.00073"
                        stroke="#fff"
                        stroke-width="1.7"
                      ></path>
                      <path
                        d="M6.49902 1.50073L1.49902 1.50073L1.49902 6.50073"
                        stroke="#fff"
                        stroke-width="1.75"
                      ></path>
                      <path
                        d="M8.99902 9.00074L13.999 14.0007"
                        stroke="#fff"
                        stroke-width="1.75"
                      ></path>
                      <path
                        d="M14.499 9.50073L14.499 14.5007L9.49902 14.5007"
                        stroke="#fff"
                        stroke-width="1.75"
                      ></path>
                    </svg>
                  )}
                </div>
                <CloseWidgetPanel />
              </div>
            )}
          </div>

          <div className="help__collections">
            {/* Navigation Header */}
            <div className="help__navigation-header help__description-container">
              {renderHeader()}
            </div>

            {/* Loading Indicator */}
            {isLoading ? (
              <div className="help__collections-scrollbar">
                <div className="pad-content">
                  <div className="chat__form-loader1">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {currentView === "article"
                  ? renderArticleView()
                  : renderItemsView()}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionDashboard;
