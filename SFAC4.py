import warnings
import pandas as pd
import json
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import sys

# Suppress specific warnings
warnings.filterwarnings("ignore", message="The parameter 'token_pattern' will not be used since 'tokenizer' is not None")

# Load data
df = pd.read_csv('CAD_dataset.csv')  # Update this path as needed

# Extract necessary columns including 'budget'
df = df[['file_idx', 'file_number', 'detail', 'company', 'materials', 'content', 'budget']]

# Convert file_idx to string
df['file_idx'] = df['file_idx'].astype(str)

# NaN 값을 빈 문자열로 대체
df['content'] = df['content'].fillna('')

# Setup TF-IDF Vectorizer
vectorizer = TfidfVectorizer(max_features=1000)

# TF-IDF vectorization on 'content' column
tfidf_matrix = vectorizer.fit_transform(df['content'])

# Function to recommend files based on new algorithm
def recommend_files(detail, companies, content, materials, df, vectorizer, n_recommendations=5):
    # detail 칼럼 우선 필터링
    filtered_df = df[df['detail'] == detail].copy()

    if filtered_df.empty:
        return pd.DataFrame(columns=['file_idx', 'detail', 'company', 'materials', 'content', 'budget'])

    # companies 값이 'ETC'인 경우를 제외하고 필터링
    if 'ALL' not in companies:
        filtered_df = filtered_df[filtered_df['company'].isin(companies)]

    # materials 값이 'etc'인 경우를 제외하고 필터링
    if 'ALL' not in materials:
        filtered_df = filtered_df[filtered_df['materials'].isin(materials)]

    # 사용자의 content_input 벡터화
    input_vector = vectorizer.transform([content])

    # 필터링된 데이터셋을 기반으로 TF-IDF 및 코사인 유사도 계산
    filtered_tfidf_matrix = vectorizer.transform(filtered_df['content'])

    # 코사인 유사도 계산
    input_sim = cosine_similarity(input_vector, filtered_tfidf_matrix).flatten()
    
    # 유사도가 높은 순서대로 파일번호를 추천
    similar_indices = input_sim.argsort()[-n_recommendations:][::-1]
    recommendations = filtered_df.iloc[similar_indices].copy()
    
    # Convert file_idx to string
    recommendations['file_idx'] = recommendations['file_idx'].apply(lambda x: str(int(float(x))))
    
    return recommendations[['file_idx', 'file_number', 'detail', 'company', 'materials', 'content', 'budget']]

# Main function to handle command-line input
def main():
    if len(sys.argv) != 5:
        sys.exit(1)
    
    detail = sys.argv[1]
    company = sys.argv[2].split(',')
    materials = sys.argv[3].split(',')
    content = sys.argv[4]

    results = recommend_files(detail, company, content, materials, df, vectorizer)
    print(json.dumps({"results": results.to_dict(orient='records')}, ensure_ascii=False))

if __name__ == "__main__":
    main()