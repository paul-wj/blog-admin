export interface TagRequestBody {
    name: string;
    color: string;
}

export interface TagInfo {
    id: number;
    name: string;
    userId: number;
    updateTime: string;
    createTime: string;
    color: string;
    counts: number;
}

export interface CatalogRequestBody {
    name: string;
}

export interface CatalogInfo {
    id: number;
    name: string;
    userId: number;
    updateTime: string;
    createTime: string;
    counts: number;
}
