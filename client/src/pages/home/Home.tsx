import Token from "@/@types/TokenType";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { FaFolder, FaTrash } from "react-icons/fa";
import { CiImageOn } from "react-icons/ci";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import axios from "axios";
import { toast } from "sonner";
import { ReloadIcon } from "@radix-ui/react-icons";
interface FileFolder {
  type: string;
  name: string;
  createdOn: Date;
  updatedOn: Date;
  contents?: FileFolder[];
}
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const Home = () => {
  const [user, setUser] = useState<Token | null>(null);
  const [files, setFiles] = useState<FileFolder[]>([]);

  const [imageOpen, setImageOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState("");
  const [imageTitle, setImageTitle] = useState("");
  const [imageLoading, setImageLoading] = useState(false);

  const [newFolderOpen, setNewFolderOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [newFolderLoading, setNewFolderLoading] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteFile, setDeleteFile] = useState<FileFolder | null>(null);

  const [uploadImageOpen, setUploadImageOpen] = useState(false);
  const [uploadImageLoading, setUploadImageLoading] = useState(false);
  const [uploadImageFile, setUploadImageFile] = useState<File | null>(null);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      navigate("/signin");
      return;
    }
    const decoded: Token = jwtDecode(token);
    if (decoded.exp * 1000 < Date.now()) {
      navigate("/signin");
    }
    setUser(decoded);

    const path: string[] = window.location.pathname.split("/").slice(2);
    if (path.length === 1 && path[0] === "") {
      path.pop();
    }

    fetchFiles(path);
  }, [navigate]);

  window.onpopstate = () => {
    const path: string[] = window.location.pathname.split("/").slice(2);
    if (path.length === 1 && path[0] === "") {
      path.pop();
    }
    fetchFiles(path);
  };

  useEffect(() => {
    searchImage(search);
  }, [search]);

  const fetchFiles = async (path: string[]) => {
    setLoading(true);
    axios
      .post(`${import.meta.env.VITE_BACKEND_ADDRESS}/files/get`, {
        path,
      })
      .then((response) => {
        const all = [...response.data.folders, ...response.data.files];
        setFiles(all);
      })
      .catch((error) => {
        console.error(error);
        toast.error(error.response.data.error || "Failed to fetch files");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleClick = (file: any) => {
    if (file.type === "folder") {
      const path = file.path;
      navigate(path.join("/"));
      fetchFiles(path);
      return;
    }

    if (file.type === "file") {
      setImageTitle(file.name);
      setImageOpen(true);

      let path: string[] = [];

      if (search) {
        path = file.path;
      } else {
        path = window.location.pathname.split("/").slice(2);
        if (path.length === 1 && path[0] === "") {
          path.pop();
        }
      }

      getImage(path, file.name);
    }
  };

  const handleCreateFolder = () => {
    if (!newFolderName) {
      return;
    }
    setNewFolderLoading(true);
    const path: string[] = window.location.pathname.split("/").slice(2);

    if (path.length === 1 && path[0] === "") {
      path.pop();
    }

    axios
      .post(`${import.meta.env.VITE_BACKEND_ADDRESS}/files/folder/create`, {
        path: path,
        name: newFolderName,
      })
      .then(() => {
        toast.success("Folder created successfully");
        setNewFolderName("");
        setNewFolderOpen(false);
        fetchFiles(path);
      })
      .catch((error) => {
        console.error(error);
        toast.error("Failed to create folder");
      })
      .finally(() => {
        setNewFolderLoading(false);
      });
  };

  const handleDelete = () => {
    const path: string[] = window.location.pathname.split("/").slice(2);
    const file = deleteFile;

    if (!file) {
      return;
    }

    if (path.length === 1 && path[0] === "") {
      path.pop();
    }

    axios
      .post(`${import.meta.env.VITE_BACKEND_ADDRESS}/files/delete`, {
        path: path,
        name: file.name,
        type: file.type,
      })
      .then(() => {
        toast.success("Deleted successfully");
        fetchFiles(path);
      })
      .catch((error) => {
        console.error(error);
        toast.error("Failed to delete");
      });
  };

  const handleImageUpload = () => {
    if (!uploadImageFile) {
      return;
    }
    setUploadImageLoading(true);
    const path: string[] = window.location.pathname.split("/").slice(2);

    if (path.length === 1 && path[0] === "") {
      path.pop();
    }

    // Create a FileReader object to read the contents of the uploaded image file
    const reader = new FileReader();

    // When the file is loaded, convert it to a base64-encoded string
    reader.onload = () => {
      if (typeof reader.result !== "string") {
        return;
      }

      const base64Image = reader.result.split(",")[1];

      axios
        .post(`${import.meta.env.VITE_BACKEND_ADDRESS}/files/image/upload`, {
          path: path,
          file: {
            name: uploadImageFile.name,
            type: uploadImageFile.type,
            data: base64Image,
          },
        })
        .then(() => {
          toast.success("Image uploaded successfully");
          setUploadImageFile(null);
          setUploadImageOpen(false);
          fetchFiles(path);
        })
        .catch((error) => {
          console.error(error);
          toast.error("Failed to upload image");
        })
        .finally(() => {
          setUploadImageLoading(false);
        });
    };

    // Read the uploaded image file as a data URL
    reader.readAsDataURL(uploadImageFile);
  };

  const getImage = (path: string[], name: string) => {
    setImageLoading(true);
    axios
      .post(`${import.meta.env.VITE_BACKEND_ADDRESS}/files/image/get`, {
        path: path,
        name: name,
      })
      .then((response) => {
        const fileType = imageTitle.split(".").pop();
        setImageSrc(`data:image/${fileType};base64,${response.data.data}`);
      })
      .catch((error) => {
        console.error(error);
        toast.error("Failed to fetch image");
      })
      .finally(() => {
        setImageLoading(false);
      });
  };

  const searchImage = (search: string) => {
    if (search === "") {
      const path = window.location.pathname.split("/").slice(2);
      fetchFiles(path);
      return;
    }

    if (search.length < 3) {
      return;
    }

    axios
      .post(`${import.meta.env.VITE_BACKEND_ADDRESS}/files/search`, {
        query: search,
      })
      .then((response) => {
        setFiles(response.data.files);
      })
      .catch((error) => {
        console.error(error);
        toast.error("Failed to search");
      });
  };

  if (!user) {
    return null;
  }

  return (
    <div className="px-10 h-full">
      <h1 className="text-3xl font-poly">Welcome {user.firstName} </h1>
      <p className="mt-5 text-gray-500">Your files</p>

      <div className="flex gap-5">
        <Input
          placeholder="Search Images"
          className="mt-5"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="mt-5">+</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="mr-14">
            <DropdownMenuLabel>Add</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setNewFolderOpen(true)}>
              Create Folder
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setUploadImageOpen(true)}>
              Upload an Image
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="h-[60vh] mt-5 rounded-2xl p-5 flex flex-wrap gap-5">
        {loading ? (
          <div className="w-full text-center flex items-center justify-center text-gray-500">
            <ReloadIcon className="animate-spin h-8 w-8" />
          </div>
        ) : !files || files?.length === 0 ? (
          <div className="w-full text-center text-gray-500">No files found</div>
        ) : (
          <>
            {files?.map((file, index) => (
              <ContextMenu key={index}>
                <ContextMenuTrigger>
                  <Card
                    onClick={() => handleClick(file)}
                    className="h-[20vh] w-[20vh] flex items-center justify-center flex-col cursor-pointer hover:bg-gray-100 rounded-2xl transition-all duration-300 ease-in-out "
                  >
                    {file.type === "folder" ? (
                      <FaFolder className=" text-primary" size={100} />
                    ) : (
                      <CiImageOn className=" text-primary" size={100} />
                    )}

                    <p className="text-gray-500 truncate text-xs text-center w-[50%]">
                      {file.name}
                    </p>
                  </Card>
                </ContextMenuTrigger>
                <ContextMenuContent>
                  <ContextMenuItem
                    className="flex justify-between"
                    onClick={() => {
                      setDeleteFile(file);
                      setDeleteOpen(true);
                    }}
                  >
                    Delete <FaTrash className="text-red-500" size={12} />
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            ))}
          </>
        )}
      </div>

      <Dialog open={imageOpen} onOpenChange={setImageOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{imageTitle}</DialogTitle>
            <DialogDescription asChild>
              {imageLoading ? (
                <div className="flex items-center justify-center h-20">
                  <ReloadIcon className="h-4 w-4 animate-spin" />
                </div>
              ) : (
                <img src={imageSrc} alt="" className="pt-3" />
              )}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Dialog open={newFolderOpen} onOpenChange={setNewFolderOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Folder</DialogTitle>
            <DialogDescription>
              <Input
                placeholder="Folder Name"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                className="mt-5"
              />
              <Button
                onClick={handleCreateFolder}
                className="mt-5"
                disabled={!newFolderName}
              >
                {newFolderLoading ? (
                  <ReloadIcon className="h-4 w-4 animate-spin" />
                ) : (
                  "Create Folder"
                )}
              </Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              folder
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button onClick={handleDelete} variant="destructive">
                Delete
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={uploadImageOpen} onOpenChange={setUploadImageOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Image</DialogTitle>
            <DialogDescription>
              <input
                type="file"
                onChange={(e) =>
                  setUploadImageFile(e.target.files?.[0] as File)
                }
              />
              <Button
                onClick={handleImageUpload}
                className="mt-5"
                disabled={!uploadImageFile}
              >
                {uploadImageLoading ? (
                  <ReloadIcon className="h-4 w-4 animate-spin" />
                ) : (
                  "Upload Image"
                )}
              </Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Home;
