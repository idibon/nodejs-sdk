Nodejs SDK for Idibon 
===========

Samples of usage are located in the `samples/api/` subdirectory.

A full test suite is located in the `test/` subdirectory. You can run it by calling `jasmine-node test/*` from the main folder. 

## Sample Apps

Name|Description
--------|--------
[listCollections](#listCollections)|Lists all collections
[createCollection](#createCollection)|Creates a new collection
[deleteCollection](#deleteCollection)|Deletes an existing collection
[createDocuments](#createDocuments)|Uploads a set of documents to a collection
[fetchDocuments](#fetchDocuments)|Fetches multiple documents from a collection
[deleteDocument](#deleteDocument)|Deletes a document from a collection
[createTask](#createTask)|Create a new task to start assigning labels
[addTaskLabels](#addTaskLabels)|Add label possibilities to an existing task
[createAnnotation](#createAnnotation)|Add an annotation for a task to a document
[createClassification](#createClassification)|Generate predictions for unstored text 

### <a name="listCollections">listCollections Sample App</a>

This application lists all collections that are available using your API key.
To Use:

```
cd samples/api
node listCollections.js $API_KEY
```


### <a name="createCollection">createCollection Sample App</a>

This application creates a brand new collection. 
To Use:

```
cd samples/api
node createCollection.js $API_KEY $COLLECTION $DESCRIPTION
```

* `$COLLECTION` should be a String specifying the new collection's name.

* `$DESCRIPTION` should be a String, and contain a description of the new collection.


### <a name="deleteCollection">deleteCollection Sample App</a>

This application deletes an existing collection. To avoid accidental bulk deletes, the collection must be empty of all documents before it can be deleted. The collection is assumed to exist. 
To Use:

```
cd samples/api
node deleteCollection.js $API_KEY $COLLECTION
```

* `$COLLECTION` should be a String specifying the doomed collection's name.



### <a name="createDocuments">createDocuments Sample App</a>

This application adds a set of new documents to a currently existing collection. It is assumed that the collection already exists.
To Use:

```
cd samples/api
node createDocument.js $API_KEY $COLLECTION $UPLOAD_FILE
```

* `$COLLECTION` should be a String specifying the name of the relevant collection.

* `$UPLOAD FILE` should be a String specifying the file containing the documents to be uploaded. New lines should separate each individual document. Each line can specify the `name`, the `content`, and the `metadata`. The name is optional, if it's not provided then the API will assign an internally-generated name:

```
{"name": "Document name1", "content": "Document content1", "metadata": { ... } }
{"name": "Document name2", "content": "Document content2", "metadata": { ... } }
{"name": "Document name3", "content": "Document content3", "metadata": { ... } }
...
```


### <a name="fetchDocuments">fetchDocuments Sample App</a>

This application fetches all documents from an existing collection. 
To Use:

```
cd samples/api
node fetchDocuments.js $API_KEY $COLLECTION $TASK
```

* `$COLLECTION` should be a String specifying the collection. Only documents that are a part of this collection will be returned.

* `$TASK` should be a String specifying the task. Only documents associated with this task will be returned.


### <a name="deleteDocument">deleteDocument Sample App</a>

This application deletes a single document from a collection.
To Use:

```
cd samples/api
node deleteDocument.js $API_KEY $COLLECTION $DOC_NAME
```

* `$COLLECTION` should be a String specifying the name of the relevant collection.

* `$DOC_NAME` should be a String specifying the documents name.


### <a name="createTask">createTask Sample App</a>

This application creates a new task within a currently existing collection. The collection must already exist.
To Use:

```
cd samples/api
node createTask.js $API_KEY $COLLECTION $TASK_NAME $DESCRIPTION $SCOPE
```

* `$COLLECTION` should be a String specifying the name of the relevant collection.

* `$TASK_NAME` should be a String naming the task.

* `$DESCRIPTION` should be a String and should be a description of the task.

### <a name="addTaskLabels">addTaskLabels Sample App</a>

This application adds a possible label to an existing task. Both the relevant collection and the relevant task must already exist.
To Use:

```
cd samples/api
node addTaskLabels.js $API_KEY $COLLECTION $TASK $LABEL_NAME $LABEL_DESCRIPTION
```

* `$COLLECTION` should be a String specifying the name of the relevant collection.

* `$TASK` should be a String naming the task that will contain this label.

* `$LABEL_NAME` should be a String specifying the name of the new label.

* `$LABEL_DESCRIPTION` should be a String containing the description of the new label.


### <a name="createAnnotation">createAnnotation Sample App</a>

This application adds an annotation to an existing document. The document and relevant collection must already exist.
To Use:

```
cd samples/api
node createAnnotation.js $API_KEY $COLLECTION $DOCUMENT $TASK $LABEL
```


* `$COLLECTION` should be a String specifying the name of the relevant collection.

* `$DOCUMENT` should be a String specifying the document to which the annotation will be attached.

* `$TASK` should be a String naming the task that will contain this annotation.

* `$LABEL` should be a String and should specify the label of the annotation.


### <a name="createClassification">createClassification Sample App</a>

Generates a classification for a document. This requires that the relevant task has a trained model associated with it. The task, collection, and document are assumed to exist.
To Use:

```
cd samples/api
node createClassification.js $API_KEY $COLLECTION $TASK $DOCUMENT
```

* `$COLLECTION` should be a String specifying the name of the relevant collection.

* `$TASK` should be a String specifying the task used to generate the classification.

* `$DOCUMENT` should be a String specifying the document on which the classification will be made.
