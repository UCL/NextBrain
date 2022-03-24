import numpy as np
import os, os.path
import matplotlib.image as matlib
import enum

class Projections(enum.Enum):
    AXIAL = 1
    SAGITTAL = 2
    CORONAL = 3

IMAGE_ROOT = '/Users/peterschmidt/BrainAtlas/react-ui/src/assets/P57-16/'
MRI_ROOT = 'mri'
MRI_ROTATED_ROOT = 'mri_rotated'

class TestCoordinates:

    def __init__(self, x,y,z, expectedValue):
        self.x = x
        self.y = y
        self.z = z
        self.x_tr = x
        self.y_tr = y
        self.z_tr = z
        self.expectedValue = expectedValue
        self.projection = Projections.AXIAL

    def transform(self, projection):
        if projection == Projections.AXIAL:
            self.x_tr = self.x
            self.y_tr = self.y
            self.z_tr = self.z
            self.projection = Projections.AXIAL
        if projection == Projections.SAGITTAL:
            self.x_tr = self.y
            self.y_tr = self.z
            self.z_tr = self.x
            self.projection = Projections.SAGITTAL
        if projection == Projections.CORONAL:
            self.x_tr = self.x
            self.y_tr = self.z
            self.z_tr = self.y
            self.projection = Projections.CORONAL


set1 = TestCoordinates(x=99, y=212, z=127, expectedValue=33)
set2 = TestCoordinates(x=60, y=273, z=186, expectedValue=45)
set3 = TestCoordinates(x=82, y=207, z=246, expectedValue=2)

test_list = []
test_list.append(set1)
test_list.append(set2)
test_list.append(set3)

def stringifySliceID(slice):
    if slice < 10:
        return "slice_00" + str(slice)
    if slice < 100:
        return "slice_0" + str(slice)
    return "slice_" + str(slice)


def selectNumpyArray(slice, projection, isRotatedFolder):
    slicename = stringifySliceID(slice) + ".npy"
    numpy_folder_base = MRI_ROTATED_ROOT if isRotatedFolder else MRI_ROOT
    numpy_folder = IMAGE_ROOT + numpy_folder_base
    if projection == Projections.AXIAL:
        numpy_folder = numpy_folder + "/indices_axial"
    elif projection == Projections.SAGITTAL:
        numpy_folder = numpy_folder + "/indices_sagittal"
    elif projection == Projections.CORONAL:
        numpy_folder = numpy_folder + "/indices_coronal"
    else:
        numpy_folder = numpy_folder + "/indices_axial"

    numpy_file = numpy_folder + "/" + slicename
    try:
        npy_array = np.load(numpy_file)
        return npy_array
    except IOError as ioerr:
        print('IO Numpy error: ',ioerr)
    except ValueError as verr:
        print('Value Numpy error: ',verr)

    return np.empty([1,1],dtype=int)

def printNumpyArrayCharacteristics(npy_array):
    shape = npy_array.shape
    isFortran_order = np.isfortran(npy_array)

    message = "The shape of the array is " + str(shape) + " and the FORTRAN flag is " + str(isFortran_order)
    return message

def checkDimensions(x,y,np_array):
    shape = np_array.shape
    if x < shape[0] and y < shape[1]:
        return True
    return False

def checkInvertedDimensions(x,y,np_array):
    shape = np_array.shape
    if y < shape[0] and x < shape[1]:
        return True
    return False

def rotateXY(x,y,np_array):
    center =  (np.array(np_array.shape) - 1)/2
    x_rot = (-y + 2 * center[1]).astype('int')
    y_rot = (2*center[0] - x).astype('int')
    return x_rot, y_rot

def inverseRotateXY(x,y, np_array):
    center = (np.array(np_array.shape) -1) / 2
    x2 = (-y + 2 * center[1]).astype('int')
    y2 = (-x + 2 * center[0]).astype('int')
    return x2,y2

def get_coordinates(x,y,np_array, isRotated):
    x_tr = x
    y_tr = y
    if isRotated:
        print("rotate co-ordinates")
        x_tr, y_tr = rotateXY(x,y,np_array)
#        x_tr, y_tr = inverseRotateXY(x,y,np_array)

    if checkDimensions(x_tr,y_tr,np_array):
        print("The co-ordinates are within the dimensions of the array")
    else:
        if checkInvertedDimensions(x_tr,y_tr,np_array):
            print("we have to swap x,y co-ordinates to be within the bounds of np_array")
            tmp_y = y_tr
            y_tr = x_tr
            x_tr = tmp_y
        else:
            print("Something is seriously wrong - even swapping the co-ordinates doesn't get us within the array dimensions")
            return -1, -1
    return x_tr, y_tr


def test_single_set(set, projections, isRotatedFolder=False, rotateCoOrdinates=False):
    np_array = selectNumpyArray(set.z_tr, projections, isRotatedFolder)
    if np_array.shape == (1,1):
        print("We couldn't get the NUMPY data - aborting")
        return

    message = printNumpyArrayCharacteristics(np_array)
    print(message)
    x,y = get_coordinates(set.x_tr, set.y_tr, np_array, isRotated=rotateCoOrdinates)
    if x == -1 and y == -1:
        print("the x,y co-ordinates are beyond the boundaries of the NUMPY array")
        return

    block = np_array[x,y]
    if block == set.expectedValue:
        print("CORRECT: expected = {} calculated = {} for  co-ordinates x={}, y={}".format(set.expectedValue, block, x, y))
    else:
        print("+++ERROR!!: expected = {} calculated = {} for  co-ordinates x={}, y={}".format(set.expectedValue, block, x, y))


def test_all_sets(projections, isRotatedFolder=False, rotate=False):
    for set in test_list:
        print("************ Test Set Start at Projection {} ****************".format(projections))
        if projections == Projections.AXIAL:
            test_single_set(set, projections, isRotatedFolder, rotate)
        if projections == Projections.SAGITTAL:
            set.transform(Projections.SAGITTAL)
            test_single_set(set, projections, isRotatedFolder, rotate)
        if projections == Projections.CORONAL:
            set.transform(Projections.CORONAL)
            test_single_set(set, projections, isRotatedFolder, rotate)
        print("************ Test Set End ****************\n")
    print("<---------------------------------------------------------> ")


print("************* Using mri and NO rotation *******************\n ")
test_all_sets(Projections.AXIAL)
test_all_sets(Projections.SAGITTAL)
test_all_sets(Projections.CORONAL)

print("************* Using mri_rotated and NO rotation *******************\n ")
test_all_sets(Projections.AXIAL, isRotatedFolder=True)
test_all_sets(Projections.SAGITTAL, isRotatedFolder=True)
test_all_sets(Projections.CORONAL, isRotatedFolder=True)

print("************* Using mri_rotated AND rotation *******************\n ")
test_all_sets(Projections.AXIAL, isRotatedFolder=True, rotate=True)
test_all_sets(Projections.SAGITTAL, isRotatedFolder=True, rotate=True)
test_all_sets(Projections.CORONAL, isRotatedFolder=True, rotate=True)
