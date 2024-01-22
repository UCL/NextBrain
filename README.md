# NextBrain: A next-generation, histological atlas of the human brain for high-resolution neuroimaging studies
The purpose of this project is to provide a visual and interactive tool correlating histology images with MRI scans taken from a set of patients.
Users will be able to "browse" the brain anatomy, using stained and labelled histology images and MRI scans as orientation aid.


## Raw Data
For each patient a set of images and associated data are provided
- MRI scans in 3 projections: axial, sagittal, coronal
- images of histology slices stemming from a number of different blocks (regions in the brain). Each block contains a number of image slices. Images are provided as standard and high resolution images.
- transformation matrices for moving between MRI and histology diagrams
- NUMPY arrays to map MRI region to histology blocks

### Notations
Throughout this section, the following notations will be used:
- pixel location *(x,y)*, where x describes the horizontal axis and y the vertical axis of the image
- slice/image index *z*. Images in the MRI/histology folders are labelled starting with 0. *z* describes the z-th image in this folder (i.e. image/slice with label z)
- *v* the vector representation a location in the 3-dim brain representation of either MRI or histology images. *v* is in homogeneous co-ordinates and will be used in the form: *(x,y,z,1)*
- *v'* a transformed vector. *v'* is in homogeneous co-ordinates and will be used in the form: *(x',y',z',1)*
- *A* a transformation matrix. Transformation matrices are of shape *4 x 4*, where the 4th row is 0 except for the diagonal element (1). 
- *[(x,y),z]* a co-ordinate representation, whereby the pair *(x,y)* can be represented by the pixel locations, and *z* by the slice/image index. It can be read as "pixel at location (x,y) along the z-axis"
- *axial, sagittal, coronal* : these denote image projections from MRI scans. Note: the assignment of these projections to image sequences mentioned below is for illustrative purposes only. The actual name of the projection may be different (e.g. sagittal instead of axial). However, this is only a labelling issue and does not impact the way co-ordinates are computed and/or transformed.

## Transformation between MRI image projections and histology images
The NextBrain project allows to move between images taken from MRI scans and histology images (including stained histology images). These set of images are generated in different ways. 
In order to be able to switch between these different brain section representations co-ordinate transformations need to be performed. This section describes this process in more detail. In particular:

- synchronising between MRI projections (axial, sagittal, coronal), i.e. for each given point in an image, find the corresponding points in the other projections
- synchronising between a co-ordinate in a given MRI image and a histology image, i.e. for each given point in a given MRI image find the corresponding histology image and the corresponding point within it


### Synchronising Between MRI Projections
Given a selected image/slice and pixel location for a selected projection (e.g. sagittal), the task is to find the corresponding pixel location and slice/image in the other 2 MRI projections.

#### Main Process

The table below lists the 3 MRI image projections and corresponding image dimensions, provided in this project. Each projection has its own folder and contains all the MRI image slices taken for that projection

| ... | Axial | Sagittal | Coronal |
| ----- | ----- | ----- | ----- |
| Dimension | 448 * 224 | 282 * 448 | 282 * 224 |
| No of slices/images | 282 | 224 | 448 | 

Using a 3 dimensional representation helps to switch between the different projections. The first 2 co-ordinates are given via the image dimensions (i.e. the pixels in the image). The number of images for each projection is the 3rd co-ordinate (or axis). 
As can be seen, the number of slices/images in each folder matches between all projections. 

With this it is possible to build a "unified" 3-dim representation of the brain. In this model, each projection forms an *image/slice* plane along a co-ordinate axis. Using the *axial, sagittal, coronal* notation for projections, we can write:

- axial      x_max = 447, y_max = 223 (slices along z-axis: z_max = 281 => number of images): [(x,y), z]
- sagittal   z_max = 281, x_max = 447 (slices along y-axis: y_max = 223 => number of images): [(z,x), y]
- coronal    z_max = 281, y_max = 223 (slices along x-axis: x_max = 447 => number of images): [(z,y), x]


##### Example:
Let's assume we select the following image and pixel in the *axial* image folder:
- *slice_004*, i.e. z_a = 4
- pixel *(x_a = 10, y_a = 7)* 

The 3-d co-ordinate can be written as
- [(x_a = 10, y_a = 7), z_a = 4]

Let [(x', y'), z'] be the pixel location (x',y') and image/slice index z' in each of the following projections. 
Given the values for the *axial* co-ordinates, the following transformations apply:
- *sagittal* x' = z_a, y' = x_a, z' = y_a. I.e. [(x' = 4, y' = 10), z' = 7]. Or pixel (4,10) in slice_007 in the sagittal folder
- *coronal* x' = z_a, y' = y_a, z' = x_a. I.e. [(x' = 4, y' = 7), z' = 10]. Or pixel (4,7) in slice_010 in the coronal folder


### Synchronising between MRI and Histology images

#### From MRI to Histology
Histology images or slices are generated in a different way than MRI images. Therefore, the mapping between co-ordinates between histology and MRI images can only be approximate. Furthermore, there may not be a corresponding histology image for a selected pixel in an MRI image. 

Histology slices (and images) are created from blocks of brain tissue. 
Each block is identified with a label/number and corresponds to one area in the brain. 
*NOTE*: block labelling starts at index = 1. A block value of 0 is reserved for areas with no matching tissue in histology images.

In principle the matching of co-ordinates follows the three steps below:
- for a given pixel find the corresponding histology block. This is facilitated by a number of stored pixel arrays (stored as NUMPY arrays) in the MRI folder (see below)
- if a corresponding block is found, select the corresponding matrix 
- build a vector from the pixel co-ordinates and slice index and transform them into (x,y,z) co-ordinates for the histology images. 

Here is a more detailed description of each step:

##### Finding the corresponding histology block
In the images/<patient>/mri folder of the project we have 3 folders called:
- indices_axial
- indices_sagittal
- indices_coronal
Each folder contains a number of binary arrays (in NUMPY format) that are a 2 dimensional (pixel by pixel) representation of each image slice for axial, sagittal, coronal projections. The number of NMPY files corresponds exactly to the number of image slices for the axial/sagittal/coronal projections.
The NUMPY array specifies for each pixel in each slice the histology block it corresponds to.
*NOTE*: a value of 0 means => no corresponding histology block available

Example:
Let's use the same example we used for synchronising between MRI images. I.e. 
- select image slice_004 and in there a pixel of value (x=10, y=7). That is [(x = 10, y = 7), z = 4]

We can then find the corresponding block by:
- open slice_004.npy and read into a 2 dim,. e.g. array[][]
- read the array value array[10][7]


##### Applying the transformation of co-ordinates
Once we have the 3-dimension co-ordinates from an MRI image and identified a corresponding block ID, we can then apply a transformation to find the pixel in the corresponding histology image.

The steps in this section are:
- find the transformation matrix *A* 
- build a transformation vector *v*
- perform the transformation *v'* = *A* * *v*; where *v'* is the transformed co-ordinate vector

How do we find the block?

Each block with label L, has a corresponding 4x4 transformation matrix. These can be found in the following folder
- /images/<patient>/matrices (for standard resolution histology images)
- /images/<patient>/matrices_hr (for high resolution histology images)
Block matrices in these folders are called
- block_*L*.txt, where *L* is the block ID

Example:
Let's assume we found a corresponding block for histology, e.g. block No *26* (they are labelled from 1...45)
The transformation matrix for standard res images in found in file
*block_26.txt* 

This is a 4x4 matrix, which looks like this

| 0.032133931694333664 | 3.49719831461958 | -1.972503357700436 | 40.325292337980784 |
| 1.0508095109766031 | -1.908419529278237 | -3.3734531721503673 | 548.0686819130044 |
| -0.6701068560093678 | -0.08577660617009603 | -0.16640329181257396 | 135.59958866941196 |
| 0.0 | 0.0 | 0.0 | 1.0 |

Next, we construct a 4 dim vector given the 3-d co-ordinates from the example above, i.e. [(x=10, y=7), z=4].
The vector *v* will then be (4th element is always 1!)
(x=10, y=7, z=4, 1) 
We can then perform a matrix multiplication. Let v' be the transformed vector, v the original vector with the MRI image co-ordinates and A the transformation matrix:

v' = A * v

v' is again 4 dimensional, where v' = (x', y', z', 1)

##### Picking the histology slice
The locations of histology images are:
- images/histology (standard resolution)
- images/histology_hr (high resolution)
Each histology folder has a number of subdirectories is labelled from "01 ... N", where the label denotes the *block* ID. 
The images/slices for each block are then listed in *block* subdirectories called
*slices_HE*, *slices_LFB*, *slices_MRI*. (this depends on the selection of the user in the web page).

In short the structure is like this:
*patient* -> histology -> block_number -> slices_HE...

The image and pixel in the image can then be selected given the transformed co-ordinates from above.

Example:
The user selected *HE*, i.e. we will be showing the corresponding histology image from the *slices_HE* folder.
In the previous section, we computed the transformed vector *v'* for a histology image in *block 26*. The transformed vector should be of form
*(x', y', z', 1)*
where
- *(x', y')* are the pixel values in slice/image with label *z'* 

##### Which co-ordinates are the right ones?
Remember there are 3 MRI projections: axial, sagittal and coronal! They all refer to the same 3-dim brain volume co-ordinates (x,y,z). However, each projection shows images along a different co-ordinate axis.

Let's define one projection, let's call it axial, *[(x,y),z]* as a "reference" projection. The transform between MRI and histology images should always be performed on this reference projection to ensure consistency.

### Synchronising between Histology MRI images
Going from a point in a histology image to a corresponding point in the MRI image projections follows similar paths as described above.
*NOTE*: we will be using the "reference" MRI projection (in this example 'axial') to which we will transform the co-ordinates.

For histology images, the relevant matrices can be found in each *block* folder, called *L*, where *L=01...N* (N=the last block index). The matrix values are in file
*matrix.txt* 
in that folder

The following steps need to be performed:
- from the selected pixel in a selected histology image build the vector *v_h = [(x_h, y_h), z_h, 1]*
- read the values from *matrix.txt* into a 4x4 matrix *A_h*. *NOTE*: this matrix will be the inverse to the matrix used to transform from MRI to a histology image.
- perform the matrix multiplication to obtained the transformed vector *v'_mri = [(x'_mri, y'_mri), z'_mri, 1]*. Note that this vector will again be 4-dim
- use the coordinates *[(x'_mri, y'_mri), z'_mri]* to select the image in the "reference" projection of index *z'_mri* with pixel values *(x'_mri, y'_mri)* 








