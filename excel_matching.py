import numpy as np
import pandas as pd

from gensim.models import Word2Vec


from string import punctuation
from nltk import word_tokenize
from nltk.corpus import stopwords
from sklearn.cluster import KMeans


raw_mentee = pd.read_excel("mentee.xlsx")
raw_mentor = pd.read_excel("mentor.xlsx")

clean_mentee = {'Name': raw_mentee["Name"],
                'Origin': raw_mentee["Country of Origin"],
                'Language': raw_mentee["What language(s) do you speak?"],
                'Prefer': raw_mentee["Which area do you prefer to be mentored in?"],
                'Expectation': raw_mentee["What are your preferred expectations and outcomes from this program?"],
                'Skills': raw_mentee["What are the skills you are interested in being mentored in?"],
                'Research': raw_mentee["What are the top research areas you are interested in being mentored in?"],
                'Advice': raw_mentee["What form(s) of career advice(s) you are interested in being mentored on?"],
                'Conference': raw_mentee["Which conferences would you like to present your research at?"]
}

clean_mentor = {'Name': raw_mentor["Name"],
                'Origin': raw_mentor["Country of Origin"],
                'Language': raw_mentor["What language(s) do you speak?"],
                'Prefer': raw_mentor["Which area do you prefer to mentor?"],
                'Expectation': raw_mentor["What are your preferred expectations and outcomes from this program?"],
                'Skills': raw_mentor["What skills do you want to help mentees to improve?"],
                'Research': raw_mentor["What are the research areas you can consider mentoring?"],
                'Advice': raw_mentor["What form(s) of career advice(s) could you mentor?"],
                'Conference': raw_mentor["Which conferences would you like to align your mentorship with?"]
}

clean_mentee_df = pd.DataFrame(clean_mentee)
clean_mentor_df = pd.DataFrame(clean_mentor)

clean_mentee_df.drop_duplicates(subset=['Name'], keep='first', inplace=True)
clean_mentor_df.drop_duplicates(subset=['Name'], keep='first', inplace=True)

clean_mentee_df.fillna('', inplace=True)
clean_mentor_df.fillna('', inplace=True)

text_columns = ['Origin', 'Language', 'Prefer', 'Expectation', 'Skills', 'Research', 'Advice', 'Conference']

mentee_df = clean_mentee_df.copy()
mentee_df["text"] = mentee_df[text_columns].apply(lambda x: " | ".join(x), axis=1)

mentor_df = clean_mentor_df.copy()
mentor_df["text"] = mentor_df[text_columns].apply(lambda x: " | ".join(x), axis=1)

mentee_df = mentee_df.applymap(lambda x: x.replace("'", ""))
mentor_df = mentor_df.applymap(lambda x: x.replace("'", ""))

def clean_text(dataframe):
    """Pre-process text and generate tokens"""
    sw = stopwords.words('english')

    # tokenize
    dataframe['tokens'] = dataframe['text'].apply(word_tokenize)
    dataframe['tokens'] = dataframe['tokens'].apply(lambda x: [i for i in x if i not in punctuation])
    dataframe['tokens'] = dataframe['tokens'].apply(lambda x: [i.lower() for i in x if i not in sw])
    dataframe['tokens'] = dataframe['tokens'].apply(lambda x: [i.strip() for i in x])

mentee_df["Name"] = mentee_df["Name"].str.strip()
mentor_df["Name"] = mentor_df["Name"].str.strip()


clean_text(mentee_df)
clean_text(mentor_df)

mentee_tt = mentee_df.loc[mentee_df.tokens.map(lambda x: len(x) > 0), ["Name", "text", "tokens"]]
mentor_tt = mentor_df.loc[mentor_df.tokens.map(lambda x: len(x) > 0), ["Name", "text", "tokens"]]

both_tt = pd.concat([mentee_tt, mentor_tt])
docs = both_tt["text"].values
tokenized_docs = both_tt["tokens"].values
names = both_tt["Name"].values

model = Word2Vec(sentences=tokenized_docs, vector_size=80, min_count=2, workers=4, seed=42)

def vectorize(list_of_docs, model):
    """Generate vectors for list of documents using a Word Embedding

    Args:
        list_of_docs: List of documents
        model: Gensim's Word Embedding

    Returns:
        List of document vectors
    """
    features = []

    # tokens = ['12th', 'man', 'arrested', 'statutory', 'rape', 'case', 'alabama', 'college', 'get', 'breaking', 'national',
    for tokens in list_of_docs:
        # model.vector_size = 100
        zero_vector = np.zeros(model.vector_size)
        
        vectors = []
        for token in tokens:
            if token in model.wv:
                try:
                    # model.wv["trump"], length = 100
                    vectors.append(model.wv[token])
                except KeyError:
                    continue
        if vectors:
            # vector shape = (44, 100) or (31, 100)
            vectors = np.asarray(vectors)
            # avg_vec shape = (100,)
            avg_vec = vectors.mean(axis=0)
            features.append(avg_vec)
        else:
            features.append(zero_vector)
    return features

vectorized_docs = vectorize(tokenized_docs, model=model)


def kmeans_clusters(X, k):
    """Generate clusters.

    Args:
        X: Matrix of features.
        k: Number of clusters.

    Returns:
        Trained clustering model and labels based on X.
    """
    km = KMeans(n_clusters=k, n_init=10, max_iter=300, init='k-means++').fit(X)
    
    return km, km.labels_

clustering, cluster_labels = kmeans_clusters(X=vectorized_docs, k=9)

df_clusters = pd.DataFrame({
    "Name": names,
    "cluster": cluster_labels
})

cluster_mentee = df_clusters.loc[df_clusters["Name"].isin(mentee_df["Name"]), ["Name", "cluster"]].copy()
cluster_mentor = df_clusters.loc[df_clusters["Name"].isin(mentor_df["Name"]), ["Name", "cluster"]].copy()

final_cluster_df = pd.merge(cluster_mentee, cluster_mentor, on="cluster", how="inner", suffixes=("_mentee", "_mentor"))
print(final_cluster_df[final_cluster_df.Name_mentee == "Gunter Pearson"])
