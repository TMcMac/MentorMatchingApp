import numpy as np
import pandas as pd

from gensim.models import Word2Vec


from string import punctuation
from nltk import word_tokenize
from nltk.corpus import stopwords
from sklearn.cluster import KMeans


# import or make api call for mentee and mentor list
# mentees = api_call() <------ fill with api call function for mentees
# mentors = api_call() <------ fill with api call function for mentors

# Convert JSON to pd.DataFrame
mentee_raw = pd.DataFrame(mentees)
mentor_raw = pd.DataFrame(mentors)

# extract only the necessary columns
col_list = ["fullName", "countryOrigin", "languages", "mentorshipArea", "prefferedOutcomes", "skillMentorship", "researchAreas", "careerAdvice", "conferencePreference"]
clean_mentee = mentee_raw[col_list].copy()
clean_mentor = mentor_raw[col_list].copy()


# drop all duplicates
clean_mentee.drop_duplicates(subset=['fullName'], keep='first', inplace=True)
clean_mentor.drop_duplicates(subset=['fullName'], keep='first', inplace=True)

# convert all column dtypes to string
for col in col_list:
    clean_mentee[col] = clean_mentee[col].astype(str)
    clean_mentor[col] = clean_mentor[col].astype(str)


# fill all missing values with empty string
clean_mentee.fillna('', inplace=True)
clean_mentor.fillna('', inplace=True)


# create new text column for creating tokens
mentee_df = clean_mentee.copy()
mentee_df["text"] = mentee_df[col_list[1:]].apply(lambda x: " | ".join(x), axis=1)

mentor_df = clean_mentor.copy()
mentor_df["text"] = mentor_df[col_list[1:]].apply(lambda x: " | ".join(x), axis=1)


# remove single quotes
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


clean_text(mentee_df)
clean_text(mentor_df)


# remove empty tokens
mentee_tt = mentee_df.loc[mentee_df.tokens.map(lambda x: len(x) > 0), ["fullName", "text", "tokens"]]
mentor_tt = mentor_df.loc[mentor_df.tokens.map(lambda x: len(x) > 0), ["fullName", "text", "tokens"]]

# concat both dataframes to train word2vec model on vocab
both_tt = pd.concat([mentee_tt, mentor_tt])
docs = both_tt["text"].values
tokenized_docs = both_tt["tokens"].values
names = both_tt["fullName"].values

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

# Create new dataframe with cluster labels
df_clusters = pd.DataFrame({
    "Name": names,
    "cluster": cluster_labels
})

# Seperate mentee from mentor
cluster_mentee = df_clusters.loc[df_clusters["Name"].isin(mentee_df["fullName"]), ["Name", "cluster"]].copy()
cluster_mentor = df_clusters.loc[df_clusters["Name"].isin(mentor_df["fullName"]), ["Name", "cluster"]].copy()

final_cluster_df = pd.merge(cluster_mentee, cluster_mentor, on="cluster", how="inner", suffixes=("_mentee", "_mentor"))
print(final_cluster_df.head())
