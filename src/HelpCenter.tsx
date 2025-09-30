import React, { useContext, useEffect, useState } from "react";
import { getSessionStoragePrefs, setSessionStoragePrefs } from "./Storage";
import Article from "./components/Article";
import Collection from "./components/Collection";
import CollectionList from "./components/CollectionList";
import { AppContext } from "./appContext";
import { PromtWidth } from "./App";
import ChatTabsList from "./components/ChatTabsList";
import { HC_ACTIVE_COMPONENT, HC_ACTIVE_ID, HC_SEARCH_TEXT } from "./globals";
import { ArticleType, CollectionType, HelpCenterItemSchema } from "./Models";
import CollectionDashboard from "./components/new/CollectionDashboard";

export default function HelpCenter() {
  const parentContext = useContext(AppContext);

  const setPromtWidth = parentContext.setPromtWidth;
  enum HCComponentNames {
    CollectionList = "CollectionList",
    Collection = "Collection",
    Article = "Article",
    V2Dashboard = "V2Dashboard", // New component name for version 2
  }

  const [version, setVersion] = useState<string | null>(null);
  const [v2CollectionsData, setV2CollectionsData] =
    useState<HelpCenterItemSchema[]>();
  const [collections, setCollections] = useState<CollectionType[]>([]);
  const [articles, setArticles] = useState<ArticleType[]>([]);
  const [activeCollection, setActiveCollection] = useState<CollectionType>();
  const [activeArticleId, setActiveArticleId] = useState<Number>();
  const [activeComponentName, setActiveComponentName] =
    useState<HCComponentNames>(
      HCComponentNames[
        (getSessionStoragePrefs(HC_ACTIVE_COMPONENT) != null &&
        getSessionStoragePrefs(HC_ACTIVE_COMPONENT) != "V2Dashboard"
          ? getSessionStoragePrefs(HC_ACTIVE_COMPONENT)
          : HCComponentNames.CollectionList) as HCComponentNames
      ]
    );
  const [searchTxt, setSearchTxt] = useState(
    getSessionStoragePrefs(HC_SEARCH_TEXT) != null
      ? getSessionStoragePrefs(HC_SEARCH_TEXT)
      : ""
  );
  useEffect(() => {
    setSessionStoragePrefs(HC_ACTIVE_COMPONENT, activeComponentName);
  }, [activeComponentName]);

  useEffect(() => {
    setSessionStoragePrefs(HC_SEARCH_TEXT, searchTxt);
  }, [searchTxt]);

  // Handle version change
  useEffect(() => {
    if (version && version.toLowerCase() === "v2") {
      setActiveComponentName(HCComponentNames.V2Dashboard);
    }
  }, [version]);

  const openCollection = (collectionId: Number) => {
    setSessionStoragePrefs(HC_ACTIVE_ID, collectionId);
    setActiveCollection(
      collections.find((collection: any) => collection.id == collectionId)
    );
    setActiveComponentName(HCComponentNames.Collection);
  };

  const openArticle = (articleId: Number) => {
    setSessionStoragePrefs(HC_ACTIVE_ID, articleId);
    setActiveArticleId(articleId);
    setActiveComponentName((previous: HCComponentNames) => {
      if (previous == HCComponentNames.CollectionList)
        setActiveCollection(undefined);
      return HCComponentNames.Article;
    });
  };

  const backToCollectionList = () => {
    setSessionStoragePrefs(HC_ACTIVE_ID, null);
    setActiveComponentName(HCComponentNames.CollectionList);
  };

  const backToCollection = (collectionId: Number | null) => {
    if (searchTxt && !activeCollection) backToCollectionList();
    else {
      setSessionStoragePrefs(HC_ACTIVE_ID, collectionId);
      setActiveComponentName(HCComponentNames.Collection);
    }
  };

  useEffect(() => {
    setSessionStoragePrefs(HC_ACTIVE_COMPONENT, activeComponentName);
  }, [activeComponentName]);

  return (
    <>
      {(() => {
        switch (activeComponentName) {
          case HCComponentNames.V2Dashboard: {
            return (
              <CollectionDashboard
                items={v2CollectionsData || []}
                searchTxt={searchTxt}
                setSearchTxt={setSearchTxt}
              />
            );
          }
          case HCComponentNames.Article: {
            return (
              <Article
                articleId={activeArticleId}
                backToCollection={backToCollection}
              />
            );
          }

          case HCComponentNames.Collection: {
            return (
              <Collection
                collection={activeCollection}
                setCollection={setActiveCollection}
                openArticle={openArticle}
                backToCollectionList={backToCollectionList}
              />
            );
          }

          case HCComponentNames.CollectionList: {
            return (
              <CollectionList
                openCollection={openCollection}
                setCollections={setCollections}
                collections={collections}
                setArticles={setArticles}
                searchTxt={searchTxt}
                openArticle={openArticle}
                setSearchTxt={setSearchTxt}
                articles={articles}
                setVersion={setVersion}
                setV2CollectionsData={setV2CollectionsData}
              />
            );
          }

          default:
            return <></>;
        }
      })()}

      {activeComponentName == HCComponentNames.CollectionList ||
      activeComponentName == HCComponentNames.Collection ||
      activeComponentName == HCComponentNames.V2Dashboard ? (
        <ChatTabsList />
      ) : (
        <></>
      )}
    </>
  );
}
